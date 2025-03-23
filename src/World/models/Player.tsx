import { useEffect, useState } from "react";
import { VAR_GAME_POSE } from "../../inMemory";
import { Quaternion, Vector3 } from "three";

const LIMB_CONNECTIONS = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
    [11, 23], [12, 24], [23, 24], // Hips
    [23, 25], [25, 27], [27, 31], // Left leg
    [24, 26], [26, 28], [28, 32], // Right leg
  ];
  

const material =  <meshPhysicalMaterial 
    color={0x000000}
    emissive={0xffffff}
    emissiveIntensity={0.1}
    roughness={0.5} 
    metalness={0}
    clearcoat={1}
    clearcoatRoughness={0.5}
/>;


export const Player = () => {
  const [keypoints, setKeypoints] = useState<{x?: number; y?: number; z?: number;}[]>([]);

  useEffect(() => {
    const updatePose = () => {
      if (VAR_GAME_POSE?.keypoints3D) {
        setKeypoints(VAR_GAME_POSE.keypoints3D.map(kp => ({x: -kp.x, y: kp.y, z: kp.z})));
      }
      requestAnimationFrame(updatePose);
    };
    updatePose();
  }, []);


  return (
    <group rotation={[Math.PI, 0, 0]}> {/* Add this rotation to flip 180° around X */}
      {keypoints.map((pos, i) => {
        if (!pos.x || !pos.y || !pos.z){
          return null;
        }
        return (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            {material}
          </mesh>
        );
      })}
      {LIMB_CONNECTIONS.map(([a, b], index) => {
        if (!keypoints[a] || !keypoints[b]) return null;
        const posA = new Vector3(keypoints[a].x, keypoints[a].y, keypoints[a].z);
        const posB = new Vector3(keypoints[b].x, keypoints[b].y, keypoints[b].z);
        const mid = posA.clone().lerp(posB, 0.5);
        const length = posA.distanceTo(posB);
        const direction = new Vector3().subVectors(posB, posA).normalize();
        const quaternion = new Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0),
          direction
        );

        return (
          <mesh key={index} position={mid} quaternion={quaternion}>
          <capsuleGeometry args={[0.02, length, 10, 8]} />
            {material}
          </mesh>
        );
      })}
    </group>
  );
};
