import { useGLTF } from "@react-three/drei";
import { BASE } from "../../constants";
import { Mesh, Vector3 } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Speaker2 = ({ position }: {position: number[]}) => {
  const { scene } = useGLTF(`${BASE}Speaker2.glb`);
  const speakerMesh = scene.children[0];
    const speakerRef = useRef<Mesh>(null);
  
    useFrame(({ clock }) => {
      if (speakerRef.current) {
        const scaleFactor = 1 + Math.sin(clock.getElapsedTime() * 8) * 0.02;
        speakerRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        speakerRef.current.position.set(position[0], position[1], position[2]);
      }
    });

  return (
    <mesh ref={speakerRef} scale={0.7} position={new Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={speakerMesh} />
    </mesh>
  );
};
