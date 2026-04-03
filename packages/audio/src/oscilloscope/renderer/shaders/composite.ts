export const COMPOSITE_SHADER = /* wgsl */ `
@group(0) @binding(0) var historyTexture: texture_2d<f32>;
@group(0) @binding(1) var historySampler: sampler;

struct CompositeUniforms {
  decay: f32,
  bloom: f32,
  background: f32,
  padding: f32,
};

@group(0) @binding(2) var<uniform> uniforms: CompositeUniforms;

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

@fragment
fn fs(input: VertexOut) -> @location(0) vec4f {
  let history = textureSample(historyTexture, historySampler, input.uv);
  let faded = history.rgb * uniforms.decay;
  let glow = faded * (1.0 + uniforms.bloom * 0.35);
  return vec4f(max(glow, vec3f(uniforms.background)), 1.0);
}
`;
