import { useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import { BASE } from "../../constants";

export const Table = ({ position }: {position: number[]}) => {
    const { scene } = useGLTF(`${BASE}Table.glb`);
    if (!scene) {
      console.error('Model not loaded properly');
      return null;
    }
    const tableMesh = scene.children[0];
    return (
      <mesh scale={1} position={new Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI, 0]}>
        <primitive object={tableMesh} />
        <meshStandardMaterial attach="material" color="blue" metalness={0.8} roughness={0.2} />
      </mesh>
    );
  };
  