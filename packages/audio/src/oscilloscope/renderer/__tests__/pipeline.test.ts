import { afterEach, describe, expect, test } from "bun:test";

import type { FrameGeometry } from "../../modes/mode";
import type { OscilloscopeConfig } from "../../types";
import { createWebGpuRenderer } from "../pipeline";

const config: OscilloscopeConfig = {
  canvas: {
    aspectRatio: "1:1",
    background: 0.02,
    quality: "quality",
  },
  mode: "xy",
  phosphor: {
    bloom: 0.75,
    color: "p31-green",
    trailLength: 64,
  },
  source: {
    type: "oscillators",
    ratioLock: "1:1",
    a: {
      amplitude: 1,
      detuneCents: 0,
      frequency: 220,
      phase: 0,
      waveform: "sine",
    },
    b: {
      amplitude: 1,
      detuneCents: 0,
      frequency: 220,
      phase: 0,
      waveform: "sine",
    },
  },
};

const geometry: FrameGeometry = {
  kind: "line-strip",
  points: new Float32Array([0, 0, 0.25, 0.25, 0.5, 0]),
};

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");

afterEach(() => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, "navigator", originalNavigatorDescriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, "navigator");
});

type FakeStats = {
  bindGroupCount: number;
  deviceDestroyCount: number;
  textureDestroyCount: number;
  textureViewCount: number;
};

const createFakeGpuEnvironment = () => {
  const stats: FakeStats = {
    bindGroupCount: 0,
    deviceDestroyCount: 0,
    textureDestroyCount: 0,
    textureViewCount: 0,
  };

  const createView = () => {
    stats.textureViewCount += 1;
    return {} as GPUTextureView;
  };

  const createTexture = () =>
    ({
      createView,
      destroy: () => {
        stats.textureDestroyCount += 1;
      },
    }) as GPUTexture;

  const renderPass = {
    draw: () => {},
    end: () => {},
    setBindGroup: () => {},
    setPipeline: () => {},
    setVertexBuffer: () => {},
  } as unknown as GPURenderPassEncoder;

  const device = {
    createBindGroup: () => {
      stats.bindGroupCount += 1;
      return {} as GPUBindGroup;
    },
    createBuffer: () => ({}) as GPUBuffer,
    createCommandEncoder: () =>
      ({
        beginRenderPass: () => renderPass,
        finish: () => ({}) as GPUCommandBuffer,
      }) as GPUCommandEncoder,
    createRenderPipeline: () =>
      ({
        getBindGroupLayout: () => ({}) as GPUBindGroupLayout,
      }) as GPURenderPipeline,
    createSampler: () => ({}) as GPUSampler,
    createShaderModule: () => ({}) as GPUShaderModule,
    createTexture,
    destroy: () => {
      stats.deviceDestroyCount += 1;
    },
    queue: {
      submit: () => {},
      writeBuffer: () => {},
    } as unknown as GPUQueue,
  } as unknown as GPUDevice;

  const context = {
    configure: () => {},
    getCurrentTexture: createTexture,
  };

  const canvas = {
    getContext: (contextId: string) => (contextId === "webgpu" ? context : null),
    height: 320,
    width: 320,
  } as unknown as HTMLCanvasElement;

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      gpu: {
        getPreferredCanvasFormat: () => "bgra8unorm" as GPUTextureFormat,
        requestAdapter: async () => ({
          requestDevice: async () => device,
        }),
      },
    },
  });

  return { canvas, stats };
};

describe("createWebGpuRenderer", () => {
  test("reuses the composite bind group across frames and rebuilds it only after resize", async () => {
    const { canvas, stats } = createFakeGpuEnvironment();
    const renderer = await createWebGpuRenderer(canvas);

    expect(stats.bindGroupCount).toBe(3);
    expect(stats.textureViewCount).toBe(1);

    renderer.drawFrame(geometry, config, 1 / 60);
    renderer.drawFrame(geometry, config, 1 / 60);

    expect(stats.bindGroupCount).toBe(3);
    expect(stats.textureViewCount).toBe(3);

    renderer.resize(640, 480, 2);

    expect(stats.bindGroupCount).toBe(4);
    expect(stats.textureDestroyCount).toBe(1);

    renderer.drawFrame(geometry, config, 1 / 60);

    expect(stats.bindGroupCount).toBe(4);
  });

  test("destroys renderer-owned history textures without destroying the device", async () => {
    const { canvas, stats } = createFakeGpuEnvironment();
    const renderer = await createWebGpuRenderer(canvas);

    renderer.destroy();

    expect(stats.textureDestroyCount).toBe(1);
    expect(stats.deviceDestroyCount).toBe(0);
  });
});
