import * as THREE from 'three';


export function createOutlineMaterial() {
  var outline_shader = {
    uniforms: {
      "linewidth": { type: "f", value: 0.01 },
    },
    vertex_shader: [
      "uniform float linewidth;",
      "void main() {",
      "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
      "vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;",
      "gl_Position = projectionMatrix * displacement;",
      "}"
    ].join("\n"),
    fragment_shader: [
      "void main() {",
      "gl_FragColor = vec4( 1, 1, 1, 1.0 );",
      "}"
    ].join("\n")
  };

  var outline_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader.uniforms),
    vertexShader: outline_shader.vertex_shader,
    fragmentShader: outline_shader.fragment_shader,
    side: THREE.BackSide,
  });
  return outline_material;
}