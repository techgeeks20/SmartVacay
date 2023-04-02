import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import earthTexture from "../earth.jpg";

const Sphere = (props) => {
  const mesh = useRef();
  const texture = useLoader(THREE.TextureLoader, earthTexture);

  useFrame(() => {
    mesh.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={mesh} {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Globe = () => {
  return (
    <div className="h-screen w-full ">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <PerspectiveCamera
          fov={35} // Adjust the field of view
          position={[0, 0, 5]} // Move the camera closer to the object
          makeDefault
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Sphere />
      </Canvas>
    </div>
  );
};

export default Globe;
