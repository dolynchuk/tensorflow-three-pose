import { Quaternion, Vector3 } from "three";

const neonThickness = 0.1;

type Props = {
  halfWidth: number;
  halfDepth: number;
  yPosition: number;
};

export function EdgeNeon({halfWidth, halfDepth, yPosition}: Props){
    const edgePoints = [
      [-halfWidth, yPosition, -halfDepth],
      [halfWidth, yPosition, -halfDepth],
      [halfWidth, yPosition, halfDepth],
      [-halfWidth, yPosition, halfDepth],
    ];

      const createEdgeNeon = (startPoint: number[], endPoint: number[]) => {
        const start = new Vector3(...startPoint);
        const end = new Vector3(...endPoint);
        const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);
        const direction = new Vector3().subVectors(end, start).normalize();
        const up = new Vector3(0, 1, 0);
        const quaternion = new Quaternion().setFromUnitVectors(up, direction);
    
        return (
          <mesh key={`${startPoint.join('-')}-${endPoint.join('-')}`} position={mid} quaternion={quaternion}>
          <boxGeometry args={[neonThickness, length, neonThickness]} />
          <meshStandardMaterial
            color={0x00ff00}
            emissive={0x00ff00}
            emissiveIntensity={2}
            roughness={0.1} 
            metalness={1}
          />
        </mesh>
        );
      };

    return <>
        {createEdgeNeon(edgePoints[0], edgePoints[1])} 
        {createEdgeNeon(edgePoints[1], edgePoints[2])}
        {createEdgeNeon(edgePoints[2], edgePoints[3])}
        {createEdgeNeon(edgePoints[3], edgePoints[0])}
    </>
}