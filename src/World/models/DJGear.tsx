import { useGLTF } from "@react-three/drei";
import { BASE } from "../../constants";
import { Vector3 } from "three";

type Props = {
    position: number[];
}

export function DJGear({position}: Props){
   const { scene } = useGLTF(`${BASE}DJgear.glb`); // Adjust the path to your .glb file
     if (!scene) {
       console.error('Model not loaded properly');
       return null;
     }
     const gearMesh = scene.children[0];
     return (
       <mesh scale={0.1} position={new Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI /2, 0]}>
         <primitive object={gearMesh} />
       </mesh>
     );
}