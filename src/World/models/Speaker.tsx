import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Mesh } from "three";
import { BASE } from "../../constants";

export const Speaker = ({ position }: { position: number[] }) => {
  const { scene } = useGLTF(`${BASE}Speaker.glb`);
  const speakerRef = useRef<Mesh>(null);

  const speakerMesh = scene.children[0];

  useFrame(({ clock }) => {
    if (speakerRef.current) {
      const scaleFactor = 1 + Math.sin(clock.getElapsedTime() * 16) * 0.03;
      speakerRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
      speakerRef.current.position.set(position[0], position[1], position[2]);
    }
  });

  return (
    <mesh ref={speakerRef} position={new Vector3(position[0], position[1], position[2])} rotation={[0, 0, 0]}>
      <primitive object={speakerMesh} />
    </mesh>
  );
};
