import { Quaternion, Vector3 } from "three";
import { useState, useEffect } from "react";

const neonThickness = 0.6;

type Props = {
  halfWidth: number;
  halfDepth: number;
  yPosition: number;
};

export function EdgeNeon({ halfWidth, halfDepth, yPosition }: Props) {
  const [color, setColor] = useState(0xff0000); // Starts with red

  useEffect(() => {
    const interval = setInterval(() => {
      setColor((prevColor) => (prevColor === 0xff0000 ? 0x0000ff : 0xff0000)); // Toggle between red and blue
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
      <mesh key={`${startPoint.join("-")}-${endPoint.join("-")}`} position={mid} quaternion={quaternion}>
        <boxGeometry args={[neonThickness, length, neonThickness]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1} // Glass typically doesn't emit light
          roughness={0.1} // Very low roughness for smooth glass
          metalness={0.1} // Low metalness for glass effect
          clearcoat={1} // To give a shiny surface like glass
          clearcoatRoughness={1} // Smooth shiny surface
          reflectivity={0.1} // Glass has high reflectivity
        />
      </mesh>
    );
  };

  return (
    <>
      {createEdgeNeon(edgePoints[0], edgePoints[1])}
      {createEdgeNeon(edgePoints[1], edgePoints[2])}
      {createEdgeNeon(edgePoints[2], edgePoints[3])}
      {createEdgeNeon(edgePoints[3], edgePoints[0])}
    </>
  );
}
