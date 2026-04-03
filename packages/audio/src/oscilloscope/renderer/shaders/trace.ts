export const TRACE_SHADER = /* wgsl */ `
struct VertexOut {
  @builtin(position) position: vec4f,
};

@vertex
fn vs(@location(0) point: vec2f) -> VertexOut {
  var out: VertexOut;
  out.position = vec4f(point.x, point.y, 0.0, 1.0);
  return out;
}

@fragment
fn fs() -> @location(0) vec4f {
  return vec4f(0.45, 1.0, 0.62, 0.9);
}
`;
