import { useEffect, useRef, useState } from 'react';
import '../styles/Experience.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { CameraShake } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Model } from './Model';
import { createOutlineMaterial } from '../materials';
import { Group } from 'three';
import { cameraPositions } from '../cameraPositions';
import { Stats } from '@react-three/drei';
import _ from 'lodash';

export function Experience({ section, OnSceneLoaded, offset }) {
  const [pos, setPos] = useState(new THREE.Vector3(-50, -5, 1));
  const [moving, setMoving] = useState(false);
  const canvasRef = useRef();
  const sectionRef = useRef(0);
  useEffect(() => {
    sectionRef.current = section;
    let vector = pos;
    setMoving(true);
    setAnimation(vector, section);
  }, [section]);

  useEffect(() => {
    const handleResize = _.debounce(() => {
      let vector = pos;
      setAnimation(vector, sectionRef.current);
    }, 250);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const setAnimation = (vector, section) => {
    if (section == 0) {
      gsap.to(vector, {
        duration: 1.5,
        x: cameraPositions.home.x,
        y: cameraPositions.home.y,
        z: cameraPositions.home.z,
        onUpdate: () => setPos(vector),
        onComplete: () => {
          setMoving(false);
        },
        ease: 'sine.out'
      });
    }
    if (section == 1) {
      gsap.to(vector, {
        duration: 0.8,
        x: cameraPositions.work.x,
        y: cameraPositions.work.y,
        z: cameraPositions.work.z,
        onUpdate: () => setPos(vector),
        onComplete: () => {
          setMoving(false);
        },
        ease: 'sine.inOut'
      });
    }
    if (section == 2) {
      gsap.to(vector, {
        duration: 0.8,
        x: cameraPositions.about.x,
        y: cameraPositions.about.y,
        z: cameraPositions.about.z,
        onUpdate: () => setPos(vector),
        onComplete: () => {
          setMoving(false);
        },
        ease: 'sine.inOut'
      });
    }
  };

  return (
    <section className="experience">
      <Canvas ref={canvasRef}>
        <AdaptivePixelRatio></AdaptivePixelRatio>
        <ambientLight intensity={1} />
        <pointLight intensity={2} position={[2, 2, 0]} />
        <directionalLight castShadow position={[0, 2, 0]} />
        <Scene section={section} OnSceneLoaded={OnSceneLoaded} moving={moving} />
        <Camera cameraPos={pos} />
        {/* <Stats /> */}
      </Canvas>
    </section>
  );
}

function AdaptivePixelRatio() {
  const current = useThree((state) => state.performance.current);
  const setPixelRatio = useThree((state) => state.setDpr);
  useEffect(() => {
    setPixelRatio(window.devicePixelRatio * current);
  }, [current]);
  return null;
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

function Scene({ section, OnSceneLoaded, moving }) {
  const [mainModel, setMain] = useState(null);
  const [outline, setOutlineModel] = useState(null);
  const [animate, setAnimation] = useState(false);
  const { scene, camera, raycaster, gl } = useThree();
  const [pointLookingAt, setPoint] = useState(new THREE.Vector3(-4, 1, 2));
  const mouseOnCanvas = useRef(false);
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
    gl.domElement.addEventListener('mouseenter', function () {
      mouseOnCanvas.current = true;
    });

    gl.domElement.addEventListener('mouseleave', function () {
      mouseOnCanvas.current = false;
    });
    document.addEventListener('mouseleave', (event) => {
      setPoint(null);
    });
    document.addEventListener('mousemove', (event) => {
      if (!mouseOnCanvas.current) {
        const newMousePos = new THREE.Vector2(0, 0);
        newMousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        newMousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(newMousePos, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          setPoint(new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, 1));
        }
      }
    });
  }, []);
  useFrame((state) => {
    if (mouseOnCanvas.current) {
      raycaster.setFromCamera(state.pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        setPoint(new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, 1));
      }
    }
  });

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
        moving={moving}
      ></Model>
      {mainModel && (
        <Model
          section={section}
          customMaterial={createOutlineMaterial()}
          modelSet={setOutLine}
          animate={animate}
          pointLookingAt={pointLookingAt}
          moving={moving}
        ></Model>
      )}
    </>
  );
}
