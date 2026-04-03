export const COMPOSITE_SHADER = /* wgsl */ `
@group(0) @binding(0) var historyTexture: texture_2d<f32>;
@group(0) @binding(1) var historySampler: sampler;

struct RenderUniforms {
  fadeAlpha: f32,
  bloomStrength: f32,
  background: f32,
  glowSpread: f32,
  texelSizeX: f32,
  texelSizeY: f32,
  padding0: f32,
  padding1: f32,
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
  let center = sampleHistory(input.uv, vec2f(0.0, 0.0));
  let blur =
      center * 0.12 +
      sampleHistory(input.uv, vec2f(texel.x, 0.0)) * 0.14 +
      sampleHistory(input.uv, vec2f(-texel.x, 0.0)) * 0.14 +
      sampleHistory(input.uv, vec2f(0.0, texel.y)) * 0.14 +
      sampleHistory(input.uv, vec2f(0.0, -texel.y)) * 0.14 +
      sampleHistory(input.uv, vec2f(texel.x, texel.y)) * 0.08 +
      sampleHistory(input.uv, vec2f(-texel.x, texel.y)) * 0.08 +
      sampleHistory(input.uv, vec2f(texel.x, -texel.y)) * 0.08 +
      sampleHistory(input.uv, vec2f(-texel.x, -texel.y)) * 0.08;
  let glow = max(blur - center * 0.25, vec3f(0.0)) * (0.55 + uniforms.bloomStrength * 0.95);
  let lit = center + glow;
  let mapped = lit / (lit + vec3f(1.0));
  let lifted = max(mapped, vec3f(uniforms.background));
  return vec4f(lifted, 1.0);
}
`;
