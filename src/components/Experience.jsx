import { Children, Suspense, useEffect, useRef, useState } from 'react';
import '../styles/Experience.css';
import { Canvas, useThree, useFrame, act } from '@react-three/fiber';
import { CameraShake } from '@react-three/drei';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export function Experience() {
  return (
    <section className="experience">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight intensity={2} position={[2, 2, 0]}></pointLight>
          <directionalLight castShadow position={[0, 2, 0]}></directionalLight>
          <Scene />
          <Camera />
        </Suspense>
      </Canvas>
    </section>
  );
}

function Camera() {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.lerp(vec.set(pointer.x / 2, pointer.y / 3, 5), 0.05);
  });

  return (
    <CameraShake
      maxYaw={0.016}
      maxPitch={0.015}
      maxRoll={0.015}
      yawFrequency={0.7}
      pitchFrequency={0.5}
      rollFrequency={0.4}
    />
  );
}

function Scene() {
  const mainMesh = useRef(null);
  const gltf = useLoader(GLTFLoader, '/assets/models/ovni.gltf');
  const model = gltf;
  const { gl, scene, camera } = useThree();
  const { currentShipPositiom, setPosition } = useState([0, 2, 0]);
  let mixer;
  if (model.animations.length) {
    mixer = new THREE.AnimationMixer(model.scene);
    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });
  const meshes = loadMaterials(model);

  return (
    <>
      <primitive ref={mainMesh} object={model.scene} position={[2, -1, 0]} />
      <group position={[2, -1, 0]}>
        {meshes.map((m, index) => {
          return <Solidify key={index} meshToSolidify={m}></Solidify>;
        })}
      </group>
    </>
  );
}

function Solidify({ meshToSolidify }) {
  const geometry = meshToSolidify?.geometry;

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
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  return (
    <>
      {meshToSolidify && (
        <mesh material={materialCustom}>
          <primitive object={geometry} />
        </mesh>
      )}
    </>
  );
}

function loadMaterials(model) {
  let materialBase = null;
  let materialCrystal = null;
  let materialPanel = null;

  const texture = useLoader(TextureLoader, 'assets/imgs/fourTone.jpg');
  texture.minFilter = texture.magFilter = THREE.NearestFilter;
  const meshes = [];
  model.scene.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child);
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.name == 'BodyM') {
        if (materialBase == null) {
          materialBase = new THREE.MeshToonMaterial({
            map: child.material.map,
            gradientMap: texture,
            emissiveMap: child.material.emissiveMap,
            emissive: new THREE.Color('yellow')
          });
        }
        child.material = materialBase;
      }
      if (child.material.name == 'GlassM') {
        child.renderOrder = -10;
        if (materialCrystal == null) {
          materialCrystal = new THREE.MeshToonMaterial({
            map: child.material.map,
            gradientMap: texture,
            emissiveMap: child.material.emissiveMap,
            emissive: new THREE.Color('white'),
            transparent: true
          });
        }
        child.material = materialCrystal;
      }
      if (child.material.name == 'PanelM') {
        if (materialPanel == null) {
          materialPanel = new THREE.MeshToonMaterial({
            gradientMap: texture,
            map: child.material.map
          });
        }
        child.material = materialPanel;
      }
    }
  });
  return meshes;
}
