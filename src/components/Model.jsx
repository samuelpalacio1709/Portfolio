import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationUtils } from 'three';

export function Model({ section, customMaterial = null, modelSet, animate, pointLookingAt }) {
  const [currentSection, setSection] = useState(0);
  const [model, set] = useState(null);
  const mixer = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    new GLTFLoader().load('/assets/models/ovni.gltf', (gltf) => {
      if (customMaterial == null) {
        loadMaterials(gltf.scene);
      }
      gltf.scene.traverse((child) => {
        if (child.name === 'Head') {
          headRef.current = child;
        }
        if (customMaterial != null) {
          if (child.isMesh) {
            child.material = customMaterial;
          }
        }
      });

      set(gltf);
      modelSet(gltf);
    });
  }, []);

  useFrame((state, delta) => {
    if (headRef.current) {
      const head = headRef.current;
      head.lookAt(pointLookingAt);
    }
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });
  useEffect(() => {
    if (mixer.current) {
      setPhase(mixer.current, section, currentSection);
      setSection(section);
    }
  }, [section, mixer]);

  useEffect(() => {
    if (animate && mixer.current == null) {
      console.log('s');
      if (model?.animations.length) {
        mixer.current = new THREE.AnimationMixer(model.scene);
        const mainClip = model?.animations[0];
        SetAnimationClips(mainClip, mixer);
      }
    }
  }, [animate]);

  return <>{model && <primitive object={model.scene} position={[0, 0, 0]} />}</>;
}
function SetAnimationClips(mainClip, mixer) {
  const action1Clip = AnimationUtils.subclip(mainClip, 'All Animations', 0, 75, 24);
  const action2Clip = AnimationUtils.subclip(mainClip, 'All Animations', 75, 108, 24);

  const action1 = mixer.current.clipAction(action1Clip);
  const action2 = mixer.current.clipAction(action2Clip);

  action1.setLoop(THREE.LoopOnce);
  action1.clampWhenFinished = true;
  action1.play();
  action2.setLoop(THREE.LoopOnce);
  action2.clampWhenFinished = true;
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
