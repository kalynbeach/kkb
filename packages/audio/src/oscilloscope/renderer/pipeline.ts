import type { FrameGeometry } from "../modes/mode";
import type { OscilloscopeConfig } from "../types";
import { COMPOSITE_SHADER } from "./shaders/composite";
import { TRACE_SHADER } from "./shaders/trace";
import type { OscilloscopeRenderer } from "./types";

type GpuCanvasContext = {
  configure(configuration: {
    alphaMode: "opaque" | "premultiplied";
    device: GPUDevice;
    format: GPUTextureFormat;
  }): void;
  getCurrentTexture(): GPUTexture;
};

const GPU_BUFFER_USAGE_COPY_DST = 0x0008;
const GPU_BUFFER_USAGE_VERTEX = 0x0020;
const GPU_BUFFER_USAGE_UNIFORM = 0x0040;
const GPU_TEXTURE_USAGE_TEXTURE_BINDING = 0x0004;
const GPU_TEXTURE_USAGE_RENDER_ATTACHMENT = 0x0010;

const HISTORY_FORMAT: GPUTextureFormat = "rgba16float";
const HISTORY_USAGE =
  GPU_TEXTURE_USAGE_RENDER_ATTACHMENT | GPU_TEXTURE_USAGE_TEXTURE_BINDING;

export const createWebGpuRenderer = async (
  canvas: HTMLCanvasElement,
): Promise<OscilloscopeRenderer> => {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("Unable to acquire a WebGPU adapter.");
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu") as GpuCanvasContext | null;
  if (!context) {
    throw new Error("Unable to acquire a WebGPU canvas context.");
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ alphaMode: "opaque", device, format });

  const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPU_BUFFER_USAGE_COPY_DST | GPU_BUFFER_USAGE_UNIFORM,
  });
  const vertexBuffer = device.createBuffer({
    size: 8192 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPU_BUFFER_USAGE_COPY_DST | GPU_BUFFER_USAGE_VERTEX,
  });

  const traceModule = device.createShaderModule({ code: TRACE_SHADER });
  const compositeModule = device.createShaderModule({ code: COMPOSITE_SHADER });

  const tracePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: traceModule,
      entryPoint: "vs",
      buffers: [
        {
          arrayStride: 8,
          attributes: [{ format: "float32x2", offset: 0, shaderLocation: 0 }],
        },
      ],
    },
    fragment: {
      module: traceModule,
      entryPoint: "fs",
      targets: [
        {
          format: HISTORY_FORMAT,
          blend: {
            color: { srcFactor: "one", dstFactor: "one", operation: "add" },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: { topology: "line-strip" },
  });

  const historyCompositePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: compositeModule, entryPoint: "vs" },
    fragment: {
      module: compositeModule,
      entryPoint: "fs",
      targets: [{ format: HISTORY_FORMAT }],
    },
    primitive: { topology: "triangle-list" },
  });

  const screenCompositePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: compositeModule, entryPoint: "vs" },
    fragment: {
      module: compositeModule,
      entryPoint: "fs",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  let size = { width: Math.max(1, canvas.width), height: Math.max(1, canvas.height) };
  let readIndex = 0;
  let writeIndex = 1;

  const createHistoryTexture = () =>
    device.createTexture({
      format: HISTORY_FORMAT,
      size,
      usage: HISTORY_USAGE,
    });

  let histories = [createHistoryTexture(), createHistoryTexture()];

  const recreateHistories = () => {
    histories.forEach((texture) => texture.destroy());
    histories = [createHistoryTexture(), createHistoryTexture()];
    readIndex = 0;
    writeIndex = 1;
  };

  const resize = (width: number, height: number, devicePixelRatio: number) => {
    const nextWidth = Math.max(1, Math.floor(width * devicePixelRatio));
    const nextHeight = Math.max(1, Math.floor(height * devicePixelRatio));

    if (canvas.width === nextWidth && canvas.height === nextHeight) {
      return;
    }

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    size = { width: nextWidth, height: nextHeight };
    recreateHistories();
  };

  const drawFrame = (geometry: FrameGeometry, config: OscilloscopeConfig) => {
    const uniforms = new Float32Array([
      Math.max(0.85, 1 - config.phosphor.trailLength / 512),
      config.phosphor.bloom,
      config.canvas.background,
      0,
    ]);

    device.queue.writeBuffer(uniformBuffer, 0, uniforms);
    device.queue.writeBuffer(vertexBuffer, 0, geometry.points);

    const encoder = device.createCommandEncoder();
    const historyView = histories[writeIndex]!.createView();
    const previousHistoryView = histories[readIndex]!.createView();
    const currentTextureView = context.getCurrentTexture().createView();

    const historyBindGroup = device.createBindGroup({
      layout: historyCompositePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: previousHistoryView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    const historyPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: historyView,
          loadOp: "clear",
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: "store",
        },
      ],
    });
    historyPass.setPipeline(historyCompositePipeline);
    historyPass.setBindGroup(0, historyBindGroup);
    historyPass.draw(3);
    historyPass.setPipeline(tracePipeline);
    historyPass.setVertexBuffer(0, vertexBuffer);
    historyPass.draw(geometry.points.length / 2);
    historyPass.end();

    const screenBindGroup = device.createBindGroup({
      layout: screenCompositePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: historyView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    const screenPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: currentTextureView,
          loadOp: "clear",
          clearValue: {
            r: config.canvas.background,
            g: config.canvas.background,
            b: config.canvas.background,
            a: 1,
          },
          storeOp: "store",
        },
      ],
    });
    screenPass.setPipeline(screenCompositePipeline);
    screenPass.setBindGroup(0, screenBindGroup);
    screenPass.draw(3);
    screenPass.end();

    device.queue.submit([encoder.finish()]);
    readIndex = writeIndex;
    writeIndex = writeIndex === 0 ? 1 : 0;
  };

  return {
    destroy: () => {
      histories.forEach((texture) => texture.destroy());
    },
    drawFrame,
    resize,
  };
};
