import * as THREE from 'three';

export function createOutlineMaterial() {
  var outline_shader = {
    uniforms: {
      linewidth: { type: 'f', value: 0.01 }
    },
    vertex_shader: [
      'uniform float linewidth;',
      'void main() {',
      'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
      'vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;',
      'gl_Position = projectionMatrix * displacement;',
      '}'
    ].join('\n'),
    fragment_shader: ['void main() {', 'gl_FragColor = vec4( 1, 1, 1, 1.0 );', '}'].join('\n')
  };

  var outline_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader.uniforms),
    vertexShader: outline_shader.vertex_shader,
    fragmentShader: outline_shader.fragment_shader,
    side: THREE.BackSide,
    transparent: true
  });
  return outline_material;
}

export function createOutlineMaterialFront() {
  var outline_shader = {
    uniforms: {
      linewidth: { type: 'f', value: 0.01 }
    },
    vertex_shader: [
      'uniform float linewidth;',
      'void main() {',
      'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
      'vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;',
      'gl_Position = projectionMatrix * displacement;',
      '}'
    ].join('\n'),
    fragment_shader: ['void main() {', 'gl_FragColor = vec4( 1, 1, 1, 1.0 );', '}'].join('\n')
  };

  var outline_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(outline_shader.uniforms),
    vertexShader: outline_shader.vertex_shader,
    fragmentShader: outline_shader.fragment_shader,
    side: THREE.BackSide,
    transparent: true,
    alphaTest: 1
  });
  console.log(outline_material);
  return outline_material;
}

export function createTransparentMaterial() {
  var transparentShader = {
    uniforms: {
      // Define your uniforms here, e.g., texture, time, etc.
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() }
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
  
      void main() {
        // Your custom shader code goes here
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        gl_FragColor = vec4( 0.92, 1, 0.92, 0.16 );;
      }
    `
  };

  var outline_material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(transparentShader.uniforms),
    vertexShader: transparentShader.vertexShader,
    fragmentShader: transparentShader.fragmentShader,
    transparent: true,
    depthWrite: false
  });
  return outline_material;
}
