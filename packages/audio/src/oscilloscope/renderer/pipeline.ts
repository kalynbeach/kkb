import type { FrameGeometry } from "../modes/mode";
import type { OscilloscopeConfig } from "../types";
import { COMPOSITE_SHADER } from "./shaders/composite";
import { FADE_SHADER } from "./shaders/fade";
import { TRACE_SHADER } from "./shaders/trace";
import type { OscilloscopeRenderer } from "./types";
import { createRendererUniformValues, packRendererUniforms } from "./uniforms";

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
const MAX_VERTEX_FLOATS = 8192;

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

  const sampler = device.createSampler({
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge",
    magFilter: "linear",
    minFilter: "linear",
  });
  const uniformBuffer = device.createBuffer({
    size: 8 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPU_BUFFER_USAGE_COPY_DST | GPU_BUFFER_USAGE_UNIFORM,
  });
  const vertexBuffer = device.createBuffer({
    size: MAX_VERTEX_FLOATS * Float32Array.BYTES_PER_ELEMENT,
    usage: GPU_BUFFER_USAGE_COPY_DST | GPU_BUFFER_USAGE_VERTEX,
  });

  const traceModule = device.createShaderModule({ code: TRACE_SHADER });
  const fadeModule = device.createShaderModule({ code: FADE_SHADER });
  const compositeModule = device.createShaderModule({ code: COMPOSITE_SHADER });

  const fadePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: fadeModule, entryPoint: "vs" },
    fragment: {
      module: fadeModule,
      entryPoint: "fs",
      targets: [
        {
          format: HISTORY_FORMAT,
          blend: {
            color: {
              srcFactor: "src-alpha",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: { topology: "triangle-list" },
  });

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
            color: {
              srcFactor: "one",
              dstFactor: "one",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: { topology: "line-strip" },
  });

  const compositePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: compositeModule, entryPoint: "vs" },
    fragment: {
      module: compositeModule,
      entryPoint: "fs",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  const fadeBindGroup = device.createBindGroup({
    layout: fadePipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });
  const traceBindGroup = device.createBindGroup({
    layout: tracePipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  let historyTexture: GPUTexture | null = null;
  let historyPrimed = false;

  const createHistoryTexture = () =>
    device.createTexture({
      format: HISTORY_FORMAT,
      size: {
        width: Math.max(1, canvas.width),
        height: Math.max(1, canvas.height),
      },
      usage: GPU_TEXTURE_USAGE_RENDER_ATTACHMENT | GPU_TEXTURE_USAGE_TEXTURE_BINDING,
    });

  const rebuildHistoryTexture = () => {
    historyTexture?.destroy();
    historyTexture = createHistoryTexture();
    historyPrimed = false;
  };

  rebuildHistoryTexture();

  const resize = (width: number, height: number, devicePixelRatio: number) => {
    const nextWidth = Math.max(1, Math.floor(width * devicePixelRatio));
    const nextHeight = Math.max(1, Math.floor(height * devicePixelRatio));

    if (canvas.width === nextWidth && canvas.height === nextHeight) {
      return;
    }

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    context.configure({ alphaMode: "opaque", device, format });
    rebuildHistoryTexture();
  };

  const drawFrame = (geometry: FrameGeometry, config: OscilloscopeConfig, deltaSeconds: number) => {
    const uniforms = packRendererUniforms(
      createRendererUniformValues(config, canvas.width, canvas.height, deltaSeconds),
    );
    const history = historyTexture;

    if (!history) {
      throw new Error("Oscilloscope history texture is not initialized.");
    }

    const tracePoints =
      geometry.points.length > MAX_VERTEX_FLOATS
        ? geometry.points.subarray(0, MAX_VERTEX_FLOATS)
        : geometry.points;

    device.queue.writeBuffer(uniformBuffer, 0, uniforms);
    device.queue.writeBuffer(vertexBuffer, 0, tracePoints);

    const historyView = history.createView();
    const compositeBindGroup = device.createBindGroup({
      layout: compositePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: historyView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder();
    const historyPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: historyView,
          loadOp: historyPrimed ? "load" : "clear",
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

    historyPass.setPipeline(fadePipeline);
    historyPass.setBindGroup(0, fadeBindGroup);
    historyPass.draw(3);
    historyPass.setPipeline(tracePipeline);
    historyPass.setBindGroup(0, traceBindGroup);
    historyPass.setVertexBuffer(0, vertexBuffer);
    historyPass.draw(tracePoints.length / 2);
    historyPass.end();

    historyPrimed = true;

    const screenPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
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

    screenPass.setPipeline(compositePipeline);
    screenPass.setBindGroup(0, compositeBindGroup);
    screenPass.draw(3);
    screenPass.end();

    device.queue.submit([encoder.finish()]);
  };

  return {
    destroy: () => {
      historyTexture?.destroy();
      historyTexture = null;
      historyPrimed = false;
    },
    drawFrame,
    resize,
  };
};
