export const FADE_SHADER = /* wgsl */ `
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

@group(0) @binding(0) var<uniform> uniforms: RenderUniforms;

struct VertexOut {
  @builtin(position) position: vec4f,
};

@vertex
fn vs(@builtin(vertex_index) index: u32) -> VertexOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(3.0, 1.0),
    vec2f(-1.0, 1.0),
  );

  var out: VertexOut;
  out.position = vec4f(positions[index], 0.0, 1.0);
  return out;
}

@fragment
fn fs() -> @location(0) vec4f {
  return vec4f(vec3f(uniforms.background), uniforms.fadeAlpha);
}
`;
