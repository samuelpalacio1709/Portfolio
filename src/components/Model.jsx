import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationUtils } from 'three';
import gsap from 'gsap';
import { clamp, lerp } from 'three/src/math/MathUtils';
import { createTransparentMaterial } from '../materials';

export function Model({
  section,
  customMaterial = null,
  modelSet,
  animate,
  pointLookingAt,
  moving
}) {
  const [currentSection, setSection] = useState(0);
  const { camera } = useThree();
  const [model, set] = useState(null);
  const mixer = useRef(null);
  const spaceShipCenterRef = useRef(null);
  const headRef = useRef(null);
  const outlineRef = useRef(null);

  const speedToRotate = 2;
  useEffect(() => {
    new GLTFLoader().load('/assets/models/ovni.gltf', (gltf) => {
      if (customMaterial == null) {
        loadMaterials(gltf.scene);
      }
      gltf.scene.traverse((child) => {
        child.frustumCulled = false;

        if (child.name == 'Black_L' || child.name == 'Black_R') {
          const tl = gsap.timeline({ repeat: -1, yoyo: true });

          tl.to(child.scale, {
            duration: 0.2,
            x: child.scale.x + 0.6,
            y: 0.4,
            z: child.scale.z + 0.2,
            ease: 'sine.in',
            delay: 1.4
          });
        }
        if (child.name == 'White_L' || child.name == 'White_R') {
          const tl = gsap.timeline({ repeat: -1, yoyo: true });

          tl.to(child.scale, {
            duration: 0.2,
            y: 0.4,
            ease: 'sine.out',
            delay: 1.4
          });
        }
        if (child.name === 'Center') {
          child.userData.x = 0;
          child.userData.z = 0;
          spaceShipCenterRef.current = child;
        }
        if (child.name === 'Head') {
          child.userData.x = 0;
          child.userData.y = 0;
          child.userData.z = 0;
          headRef.current = child;
        }
        if (child.name === 'Outline') {
          child.userData.y = 0;
          outlineRef.current = child;
        }
        if (customMaterial != null) {
          if (child.isMesh) {
            child.material = customMaterial;
          }
        }

        if (child.name === 'Dome') {
          if (customMaterial != null) {
            child.visible = false;
          }
        }
        if (child.name.includes('_L') || child.name.includes('_R') || child.name == 'Outline') {
          if (customMaterial != null) {
            child.visible = false;
          }
        }
      });
      set(gltf);
      modelSet(gltf);
    });
  }, []);

  useFrame((state, delta) => {
    if (!spaceShipCenterRef.current) return;
    if (!animate) return;
    if (!spaceShipCenterRef.current) return;
    if (!headRef.current) return;
    if (!outlineRef.current) return;

    //Outline rotation
    const outline = outlineRef.current;
    outline.lookAt(camera.position);

    //Head and body rotation
    const head = headRef.current;
    const spaceship = spaceShipCenterRef.current;

    let offset = 0;
    let offsetZ = 2;
    if (section == 0) {
      offset = -2;
    } else if (section == 1) {
      offset = 6;
      offsetZ = 6;
    }

    head.userData.z = lerp(head.userData.z, offsetZ, delta * speedToRotate * 2);
    spaceship.userData.z = lerp(spaceship.userData.z, offsetZ, delta * speedToRotate * 2);

    if (pointLookingAt && !moving) {
      head.userData.x = lerp(head.userData.x, pointLookingAt.x, delta * speedToRotate * 2.5);
      head.userData.y = lerp(head.userData.y, pointLookingAt.y, delta * speedToRotate * 2);
      spaceship.userData.x = lerp(spaceship.userData.x, pointLookingAt.x, delta * speedToRotate);
    } else {
      let headWorldPos = new THREE.Vector3(0, 0, 0);
      let spaceshipWorldPos = new THREE.Vector3(0, 0, 0);
      headWorldPos = head.getWorldPosition(headWorldPos);
      spaceshipWorldPos = spaceship.getWorldPosition(spaceshipWorldPos);

      head.userData.x = lerp(head.userData.x, headWorldPos.x + offset, delta * speedToRotate);
      head.userData.y = lerp(head.userData.y, headWorldPos.y, delta * speedToRotate);
      spaceship.userData.x = lerp(
        spaceship.userData.x,
        spaceshipWorldPos.x + offset,
        delta * speedToRotate
      );
    }
    //Head rotation
    const localVectorHead = new THREE.Vector3(0, 0, 0);
    head.localToWorld(localVectorHead);
    head.lookAt(new THREE.Vector3(head.userData.x, head.userData.y, head.userData.z));

    //Spaceship rotation
    const localVector = new THREE.Vector3(0, 0, 0);
    spaceship.localToWorld(localVector);
    spaceship.lookAt(new THREE.Vector3(spaceship.userData.x, localVector.y, head.userData.z));

    //Animation mixer update
    mixer.current.update(delta);
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
  const action2Clip = AnimationUtils.subclip(mainClip, 'All Animations', 75, 93, 24);

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
      if (child.material.name == 'Star') {
        child.material = new THREE.MeshBasicMaterial({ color: 'white' });
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
      if (child.material.name == 'DomeM') {
        console.log('Dome');
        child.material = createTransparentMaterial();
        child.renderOrder = 2;
      }

      if (child.material.name == 'PanelM') {
        if (materialPanel == null) {
          materialPanel = new THREE.MeshToonMaterial({
            map: child.material.map
          });
        }
        child.material = materialPanel;
      }
      if (child.material.name == 'CHM') {
        child.material = new THREE.MeshToonMaterial({
          map: child.material.map
        });
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
