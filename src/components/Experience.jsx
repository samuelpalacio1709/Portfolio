import { useEffect, useRef, useState } from 'react';
import '../styles/Experience.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { CameraShake } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationUtils } from 'three';
import gsap from 'gsap';

export function Experience({ section, OnSceneLoaded }) {
  const [pos, setPos] = useState(new THREE.Vector3(-20, -5, 10));

  useEffect(() => {
    let vector = pos;
    if (section == 0) {
      gsap.to(vector, { duration: 2, x: 0, y: 0.5, z: 5, onUpdate: () => setPos(vector) });
    }
    if (section == 1) {
      gsap.to(vector, { duration: 2, z: 10, onUpdate: () => setPos(vector) });
    }
  }, [section]);

  return (
    <section className="experience">
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight intensity={2} position={[2, 2, 0]}></pointLight>
        <directionalLight castShadow position={[0, 2, 0]}></directionalLight>
        <Scene section={section} OnSceneLoaded={OnSceneLoaded} />
        <Camera cameraPos={pos} />
      </Canvas>
    </section>
  );
}

function Camera({ cameraPos }) {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.lerp(
      vec.set(pointer.x / 2 + cameraPos.x, pointer.y / 2 + cameraPos.y, cameraPos.z),
      0.05
    );
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

function Scene({ section, OnSceneLoaded }) {
  const [model, set] = useState(null);
  const [currentSection, setSection] = useState(0);

  const mixer = useRef(null);

  function LoadScene() {
    if (model?.animations.length) {
      mixer.current = new THREE.AnimationMixer(model.scene);
      const mainClip = model?.animations[0];
      console.log(mainClip);

      SetAnimationClips(mainClip, mixer);
    }
    OnSceneLoaded();
  }

  useEffect(() => {
    new GLTFLoader().load(
      '/assets/models/ovni.gltf',
      (gltf) => {
        loadMaterials(gltf.scene);
        set(gltf);
      },
      (e) => {
        console.log('Ready');
      }
    );
  }, []);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });
  useEffect(() => {
    if (mixer.current) {
      setPhase(mixer.current, section, currentSection);
      setSection(section);
    }
  }, [section, mixer]);

  return (
    <>
      {model && <primitive object={model.scene} position={[2, -1, 0]} />}
      {model && <Solidify section={section} onLoadScene={LoadScene}></Solidify>}
    </>
  );
}

function Solidify({ onLoadScene, section }) {
  const [currentSection, setSection] = useState(0);
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
  const [model, set] = useState(null);
  const mixer = useRef(null);
  useEffect(() => {
    new GLTFLoader().load('/assets/models/ovni.gltf', (gltf) => {
      set(gltf.scene);
      onLoadScene();
      if (gltf.animations.length) {
        const model = gltf;
        mixer.current = new THREE.AnimationMixer(model.scene);
        const mainClip = model?.animations[0];
        console.log(mainClip);

        SetAnimationClips(mainClip, mixer);
      }

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = materialCustom;
        }
      });
    });
  }, []);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });
  useEffect(() => {
    setPhase(mixer.current, section, currentSection);
    setSection(section);
  }, [section]);

  return <>{model && <primitive object={model} position={[2, -1, 0]} />}</>;
}

function SetAnimationClips(mainClip, mixer) {
  const action1Clip = AnimationUtils.subclip(mainClip, 'All Animations', 0, 75, 24);
  const action2Clip = AnimationUtils.subclip(mainClip, 'All Animations', 75, 90, 24);
  const action3Clip = AnimationUtils.subclip(mainClip, 'All Animations', 90, 120, 24);

  const action1 = mixer.current.clipAction(action1Clip);
  const action2 = mixer.current.clipAction(action2Clip);
  const action3 = mixer.current.clipAction(action3Clip);

  action1.setLoop(THREE.LoopOnce);
  action1.clampWhenFinished = true;
  action1.play();
  action2.setLoop(THREE.LoopOnce);
  action2.clampWhenFinished = true;
  action3.setLoop(THREE.LoopOnce);
  action3.clampWhenFinished = true;
}

function loadMaterials(model) {
  let materialBase = null;
  let materialCrystal = null;
  let materialPanel = null;

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.material.name == 'BodyM') {
        if (materialBase == null) {
          materialBase = new THREE.MeshToonMaterial({
            map: child.material.map,
            emissiveMap: child.material.emissiveMap,
            emissive: new THREE.Color('yellow'),
            transparent: true
          });
        }
        child.material = materialBase;
      }
      if (child.material.name == 'GlassMA') {
        if (materialCrystal == null) {
          child.renderOrder = -1000;

          materialCrystal = new THREE.MeshToonMaterial({
            map: child.material.map,
            emissiveMap: child.material.emissiveMap,
            emissive: new THREE.Color('white'),
            transparent: true,
            opacity: 0
          });
        }
        child.material = materialCrystal;
      }
      if (child.material.name == 'PanelM') {
        if (materialPanel == null) {
          materialPanel = new THREE.MeshToonMaterial({
            map: child.material.map
          });
        }
        child.material = materialPanel;
      }
    }
  });
}

function setPhase(mixer, phase, beforePhase) {
  if (mixer) {
    if (phase == beforePhase) return;
    mixer._actions[phase]
      .reset()
      .setEffectiveWeight(1)
      .crossFadeFrom(mixer._actions[beforePhase], 1)
      .play();
  }
}
