import type { FrameGeometry } from "../modes/mode";
import type { OscilloscopeConfig } from "../types";
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

  const vertexBuffer = device.createBuffer({
    size: 8192 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPU_BUFFER_USAGE_COPY_DST | GPU_BUFFER_USAGE_VERTEX,
  });

  const traceModule = device.createShaderModule({ code: TRACE_SHADER });
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
          format,
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
    primitive: { topology: "line-strip" },
  });

  const resize = (width: number, height: number, devicePixelRatio: number) => {
    const nextWidth = Math.max(1, Math.floor(width * devicePixelRatio));
    const nextHeight = Math.max(1, Math.floor(height * devicePixelRatio));

    if (canvas.width === nextWidth && canvas.height === nextHeight) {
      return;
    }

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    context.configure({ alphaMode: "opaque", device, format });
  };

  const drawFrame = (geometry: FrameGeometry, config: OscilloscopeConfig) => {
    device.queue.writeBuffer(vertexBuffer, 0, geometry.points);

    const encoder = device.createCommandEncoder();
    const currentTextureView = context.getCurrentTexture().createView();
    const pass = encoder.beginRenderPass({
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

    pass.setPipeline(tracePipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(geometry.points.length / 2);
    pass.end();

    device.queue.submit([encoder.finish()]);
  };

  return {
    destroy: () => {},
    drawFrame,
    resize,
  };
};
