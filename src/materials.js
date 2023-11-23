import * as THREE from 'three';


export function createOutlineMaterial() {
    const thickness = 0.01;
    const materialCustom = new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
        void main() {
          vec3 newPosition= position + normal * ${thickness};
          gl_Position = projectionMatrix * modelViewMatrix *vec4(newPosition,1);
        }
      `,
        fragmentShader: /* glsl */ `
        void main() {
          gl_FragColor = vec4(1,1,1,1);
        }
      `,
        side: THREE.BackSide
    });
    return materialCustom;
}