import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Tools({ section }) {
  const [model, set] = useState(null);
  const mixer = useRef(null);

  const tools = useRef(null);
  useEffect(() => {
    new GLTFLoader().load('/assets/models/icons_tools.gltf', (gltf) => {
      gltf.scene.traverse((child) => {
        child.frustumCulled = false;
      });
      if (gltf?.animations.length) {
        mixer.current = new THREE.AnimationMixer(gltf.scene);
        for (let clip of gltf.animations) {
          const action = mixer.current.clipAction(clip);
          resetAction(action);
        }
      }
      set(gltf);
    });
  }, []);

  useFrame((state, delta) => {
    //Animation mixer update
    if (!mixer.current) return;
    mixer.current.update(delta);
  });

  const scaleUp = () => {
    const tl = gsap.timeline({ repeat: 0 });
    tl.to(tools.current.scale, {
      duration: 0.2,
      x: 0.25,
      y: 0.25,
      z: 0.25,
      ease: 'sine.in',
      delay: 1
    });
  };

  const scaleDown = () => {
    const tl = gsap.timeline({ repeat: 0 });
    tl.to(tools.current.scale, {
      duration: 0.2,
      x: 0,
      y: 0,
      z: 0,
      ease: 'sine.in',
      delay: 0.2
    });
  };
  useEffect(() => {
    if (!tools.current) return;
    if (section == 2) {
      scaleUp();
    } else {
      scaleDown();
    }

    for (let clip of tools.current?.animations) {
      const action = mixer.current.clipAction(clip);
      resetAction(action);
    }
  }, [section]);

  return (
    <>
      {model && (
        <primitive
          ref={tools}
          object={model.scene}
          position={[1.25, -5, 0]}
          scale={[0, 0, 0]}
          rotation={[0, 45, 0]}
        />
      )}
    </>
  );

  function resetAction(action) {
    action.reset();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();
  }
}
