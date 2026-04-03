export const COMPOSITE_SHADER = /* wgsl */ `
@group(0) @binding(0) var historyTexture: texture_2d<f32>;
@group(0) @binding(1) var historySampler: sampler;

struct RenderUniforms {
  fadeAlpha: f32,
  traceAlpha: f32,
  backgroundLift: f32,
  glowSpread: f32,
  texelSizeX: f32,
  texelSizeY: f32,
  bloomStrength: f32,
  traceGain: f32,
};

@group(0) @binding(2) var<uniform> uniforms: RenderUniforms;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs(@builtin(vertex_index) index: u32) -> VertexOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(3.0, 1.0),
    vec2f(-1.0, 1.0),
  );
  var uvs = array<vec2f, 3>(
    vec2f(0.0, 2.0),
    vec2f(2.0, 0.0),
    vec2f(0.0, 0.0),
  );

  var out: VertexOut;
  out.position = vec4f(positions[index], 0.0, 1.0);
  out.uv = uvs[index];
  return out;
}

fn sampleHistory(uv: vec2f, offset: vec2f) -> vec3f {
  return textureSample(historyTexture, historySampler, uv + offset).rgb;
}

@fragment
fn fs(input: VertexOut) -> @location(0) vec4f {
  let texel = vec2f(uniforms.texelSizeX, uniforms.texelSizeY) * uniforms.glowSpread;
  let outerTexel = texel * 2.2;
  let center = sampleHistory(input.uv, vec2f(0.0, 0.0));
  let blur =
      center * 0.18 +
      sampleHistory(input.uv, vec2f(texel.x, 0.0)) * 0.14 +
      sampleHistory(input.uv, vec2f(-texel.x, 0.0)) * 0.14 +
      sampleHistory(input.uv, vec2f(0.0, texel.y)) * 0.14 +
      sampleHistory(input.uv, vec2f(0.0, -texel.y)) * 0.14 +
      sampleHistory(input.uv, vec2f(texel.x, texel.y)) * 0.065 +
      sampleHistory(input.uv, vec2f(-texel.x, texel.y)) * 0.065 +
      sampleHistory(input.uv, vec2f(texel.x, -texel.y)) * 0.065 +
      sampleHistory(input.uv, vec2f(-texel.x, -texel.y)) * 0.065;
  let halo =
      sampleHistory(input.uv, vec2f(outerTexel.x, 0.0)) * 0.05 +
      sampleHistory(input.uv, vec2f(-outerTexel.x, 0.0)) * 0.05 +
      sampleHistory(input.uv, vec2f(0.0, outerTexel.y)) * 0.05 +
      sampleHistory(input.uv, vec2f(0.0, -outerTexel.y)) * 0.05 +
      sampleHistory(input.uv, vec2f(outerTexel.x, outerTexel.y)) * 0.03 +
      sampleHistory(input.uv, vec2f(-outerTexel.x, outerTexel.y)) * 0.03 +
      sampleHistory(input.uv, vec2f(outerTexel.x, -outerTexel.y)) * 0.03 +
      sampleHistory(input.uv, vec2f(-outerTexel.x, -outerTexel.y)) * 0.03;
  let glow = max((blur + halo * 1.25) * (0.48 + uniforms.bloomStrength * 0.44) - center * 0.14, vec3f(0.0));
  let lit = center * (1.0 + uniforms.traceGain * 0.34) + glow;
  let phosphor = vec3f(0.72, 1.0, 0.7);
  let mapped = vec3f(1.0) - exp(-lit * vec3f(1.45, 1.22, 1.0));
  let tinted = mapped * phosphor;
  let highlight = smoothstep(0.42, 1.28, max(max(lit.r, lit.g), lit.b));
  let hotCore = mix(tinted, vec3f(0.95, 1.0, 0.9), highlight * 0.5);
  let floor = vec3f(uniforms.backgroundLift * 0.65, uniforms.backgroundLift, uniforms.backgroundLift * 0.6);
  return vec4f(max(hotCore, floor), 1.0);
}
`;
