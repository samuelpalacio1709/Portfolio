import { useEffect, useState } from 'react';
import '../styles/Experience.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { CameraShake } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Model } from './Model';
import { createOutlineMaterial } from '../materials';
import { Stats } from '@react-three/drei';

export function Experience({ section, OnSceneLoaded }) {
  const [pos, setPos] = useState(new THREE.Vector3(-50, -5, 1));
  const [pointer, setPointer] = useState(new THREE.Vector2(0, 0));
  useEffect(() => {
    let vector = pos;
    if (section == 0) {
      gsap.to(vector, {
        duration: 1.5,
        x: -2.5,
        y: 0.8,
        z: 4,
        onUpdate: () => setPos(vector),
        ease: 'sine.out'
      });
    }
    if (section == 1) {
      gsap.to(vector, {
        duration: 0.8,
        z: 7,
        x: 5,
        y: -7,
        onUpdate: () => setPos(vector),
        ease: 'sine.inOut'
      });
    }
  }, [section]);

  useEffect(() => {
    console.log;
    window.addEventListener('mousemove', (e) => {
      setPointer(new THREE.Vector2(e.offsetX, e.offsetY));
    });
  }, []);

  return (
    <section className="experience">
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight intensity={2} position={[2, 2, 0]}></pointLight>
        <directionalLight castShadow position={[0, 2, 0]}></directionalLight>
        <Scene section={section} OnSceneLoaded={OnSceneLoaded} />
        <Camera cameraPos={pos} />

        <Stats />
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
    camera.updateMatrixWorld();
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
  const [mainModel, setMain] = useState(null);
  const [outline, setOutlineModel] = useState(null);
  const [animate, setAnimation] = useState(false);
  const { scene, camera, raycaster } = useThree();
  const [pointLookingAt, setPoint] = useState(new THREE.Vector3(0, 0, 0));
  function setMainModel(model) {
    setMain(model);
  }

  function setOutLine(model) {
    setOutlineModel(model);
    StartAnimation();
  }

  function StartAnimation() {
    setAnimation(true);
    OnSceneLoaded();
  }
  useEffect(() => {
    document.addEventListener('mousemove', (event) => {
      const newMousePos = new THREE.Vector2(0, 0);
      newMousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
      newMousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(newMousePos, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        setPoint(new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, 1));
      }
    });
  }, []);

  useFrame((state, delta) => {});

  return (
    <>
      <mesh
        rotation={[0, 0, 0]}
        scale={[100, 100, 1]}
        position={[0, 0, 0]}
        material={
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthTest: false,
            depthWrite: false
          })
        }
      >
        <planeGeometry></planeGeometry>
      </mesh>
      <Model
        section={section}
        modelSet={setMainModel}
        animate={animate}
        pointLookingAt={pointLookingAt}
      ></Model>
      {mainModel && (
        <Model
          section={section}
          customMaterial={createOutlineMaterial()}
          modelSet={setOutLine}
          animate={animate}
          pointLookingAt={pointLookingAt}
        ></Model>
      )}
    </>
  );
}
