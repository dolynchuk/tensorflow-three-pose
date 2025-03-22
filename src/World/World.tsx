import { useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { VAR_GAME_POSE } from "../inMemory";
import './styles.css';
import { RepeatWrapping } from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const LIMB_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
  [11, 23], [12, 24], [23, 24], // Hips
  [23, 25], [25, 27], [27, 31], // Left leg
  [24, 26], [26, 28], [28, 32], // Right leg
];

const base = '/tensorflow-three-pose/';

const Player = () => {
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
            <meshPhysicalMaterial 
              color={0xffffff}  // Black color
              roughness={0.2}       // 0 = fully reflective, 1 = completely rough
              metalness={1}      // 1 = full metal, 0 = non-metal
              clearcoat={1}      // Enhances reflections for a wet look
              clearcoatRoughness={0} // Keeps the clearcoat smooth
            />
          </mesh>
        );
      })}
      {LIMB_CONNECTIONS.map(([a, b], index) => {
        if (!keypoints[a] || !keypoints[b]) return null;
        const posA = new THREE.Vector3(keypoints[a].x, keypoints[a].y, keypoints[a].z);
        const posB = new THREE.Vector3(keypoints[b].x, keypoints[b].y, keypoints[b].z);
        const mid = posA.clone().lerp(posB, 0.5);
        const length = posA.distanceTo(posB);
        const direction = new THREE.Vector3().subVectors(posB, posA).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction
        );

        return (
          <mesh key={index} position={mid} quaternion={quaternion}>
          <capsuleGeometry args={[0.02, length, 10, 8]} />
          <meshPhysicalMaterial 
            color={0xffffff}  // Black color
            roughness={0.2}      // 0 = fully reflective, 1 = completely rough
            metalness={1}      // 1 = full metal, 0 = non-metal
            clearcoat={1}      // Enhances reflections for a wet look
            clearcoatRoughness={0} // Keeps the clearcoat smooth
          />
          </mesh>
        );
      })}
    </group>
  );
};

function generateNoiseTexture(width: number, height: number) {
  const size = width * height;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 255;
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.LuminanceFormat);
  texture.needsUpdate = true;
  return texture;
}


const Speaker = ({ position }: {position: number[]}) => {
  const { scene } = useGLTF(`${base}Speaker.glb`); // Adjust the path to your .glb file
  
  if (!scene) {
    console.error('Model not loaded properly');
    return null;
  }

  const speakerMesh = scene.children[0]; // Assuming the speaker model is the first child

  return (
    <mesh position={new THREE.Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI / 4, 0]}>
      <primitive object={speakerMesh} />
    </mesh>
  );
};

const Speaker2 = ({ position }: {position: number[]}) => {
  const { scene } = useGLTF(`${base}Speaker2.glb`); // Adjust the path to your .glb file
  
  if (!scene) {
    console.error('Model not loaded properly');
    return null;
  }

  const speakerMesh = scene.children[0]; // Assuming the speaker model is the first child

  return (
    <mesh scale={0.7} position={new THREE.Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={speakerMesh} />
    </mesh>
  );
};

const DJGear = ({ position }: {position: number[]}) => {
  const { scene } = useGLTF(`${base}DJgear.glb`); // Adjust the path to your .glb file
  
  if (!scene) {
    console.error('Model not loaded properly');
    return null;
  }

  const speakerMesh = scene.children[0]; // Assuming the speaker model is the first child

  return (
    <mesh scale={0.1} position={new THREE.Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI /2, 0]}>
      <primitive object={speakerMesh} />
    </mesh>
  );
};

const Table = ({ position }: {position: number[]}) => {
  const { scene } = useGLTF(`${base}Table.glb`); // Adjust the path to your .glb file
  
  if (!scene) {
    console.error('Model not loaded properly');
    return null;
  }

  const tableMesh = scene.children[0];

  return (
    <mesh scale={1} position={new THREE.Vector3(position[0], position[1], position[2])} rotation={[0, Math.PI, 0]}>
      <primitive object={tableMesh} />
      <meshStandardMaterial attach="material" color="blue" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

export function World() {
  const groundTexture = useLoader(THREE.TextureLoader, `${base}ground.jpg`);

  const wallColorTexture = useLoader(THREE.TextureLoader, `${base}wall_Color.jpg`);
  const wallAoTexture = useLoader(THREE.TextureLoader, `${base}wall_AmbientOcclusion.jpg`);
  const wallDisplacementTexture = useLoader(THREE.TextureLoader, `${base}wall_Displacement.jpg`);
  const wallRoughnessTexture = useLoader(THREE.TextureLoader, `${base}wall_Roughness.jpg`);
  const wallNormalTexture = useLoader(THREE.TextureLoader, `${base}wall_Normal.jpg`);

  const wallRepeatX = 6;
  const wallRepeatY = 2;
  wallColorTexture.repeat.set(wallRepeatX, wallRepeatY);
  wallAoTexture.repeat.set(wallRepeatX, wallRepeatY);
  wallDisplacementTexture.repeat.set(wallRepeatX, wallRepeatY);
  wallRoughnessTexture.repeat.set(wallRepeatX, wallRepeatY);
  wallNormalTexture.repeat.set(wallRepeatX, wallRepeatY);

  wallColorTexture.wrapS = wallColorTexture.wrapT = THREE.RepeatWrapping;
  wallAoTexture.wrapS = wallAoTexture.wrapT = THREE.RepeatWrapping;
  wallDisplacementTexture.wrapS = wallDisplacementTexture.wrapT = THREE.RepeatWrapping;
  wallRoughnessTexture.wrapS = wallRoughnessTexture.wrapT = THREE.RepeatWrapping;
  wallNormalTexture.wrapS = wallNormalTexture.wrapT = THREE.RepeatWrapping;


  const noiseTexture = generateNoiseTexture(1, 1);

  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;

  // Define how many times the texture should repeat in each direction
  const repeatX = 10;
  const repeatY = 10;
  groundTexture.repeat.set(repeatX, repeatY);

  const halfWidth = 10 / 2;
  const halfDepth = 10 / 2;
  const neonThickness = 0.1; // Adjust for thickness of the neon light
  const wallHeight = 2; 
  const yPosition = 1.05;

  const edgePoints = [
    [-halfWidth, yPosition, -halfDepth],
    [halfWidth, yPosition, -halfDepth],
    [halfWidth, yPosition, halfDepth],
    [-halfWidth, yPosition, halfDepth],
  ];

  const createEdgeNeon = (startPoint: number[], endPoint: number[]) => {
    const start = new THREE.Vector3(...startPoint);
    const end = new THREE.Vector3(...endPoint);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const length = start.distanceTo(end);
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    // const normal = new THREE.Vector3().crossVectors(direction, up).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

    return (
      <mesh key={`${startPoint.join('-')}-${endPoint.join('-')}`} position={mid} quaternion={quaternion}>
      <boxGeometry args={[neonThickness, length, neonThickness]} />
      <meshStandardMaterial
        color={0x00ff00} // Main neon color (green)
        emissive={0x00ff00} // Emission color
        emissiveIntensity={2} // Glow intensity
        roughness={0.1} // Lower for shininess
        metalness={1} // Higher for a metallic effect
      />
    </mesh>
    );
  };

  const createWall = (position: [number, number, number], width: number, height: number, depth: number) => {
    return (
      <mesh position={position} key={`${position.join('-')}-wall`}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          map={wallColorTexture}
          aoMap={wallAoTexture}
          displacementMap={wallDisplacementTexture}
          roughnessMap={wallRoughnessTexture}
          normalMap={wallNormalTexture}
          displacementScale={1}
        />
      </mesh>
    );
  };

  return (
    <Canvas className="canvas" camera={{ position: [5, 1, 5], fov: 20 }}>
       <Bloom mipmapBlur luminanceThreshold={0.1} intensity={10} radius={0.8} />
        <ambientLight intensity={0.1} />
        <spotLight 
          position={[0, 5, 0]} // Light source position (above the scene)
          angle={Math.PI / 6}   // Narrow beam (adjust for focus)
          penumbra={0.3}        // Soft edge effect
          intensity={50}        // Strong intensity (adjust as needed)
          distance={10}         // Limit how far the light travels
          castShadow={true}     // Enables shadows
          color={0x00ffff}      // White light (change if needed)
          target-position={[0, 0, 0]} // Ensures the light points at the center
        />
         <spotLight 
            position={[- halfDepth / 2 + 0.5, 5, - halfDepth + 1.4]} // Light source position (above the scene)
            angle={Math.PI / 4}   // Narrow beam (adjust for focus)
            penumbra={0.5}        // Soft edge effect
            intensity={50}        // Strong intensity (adjust as needed)
            distance={20}         // Limit how far the light travels
            castShadow={true}     // Enables shadows
            color={0xff88ff}      // White light (change if needed)
            target-position={[- halfDepth / 2 + 0.5, 0, - halfDepth + 1.4]}
          />
        <color attach="background" args={["black"]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshPhongMaterial map={groundTexture} color={new THREE.Color().setHex(0x999922)} alphaMap={noiseTexture} />
        </mesh>
      <Player />
      {createEdgeNeon(edgePoints[0], edgePoints[1])} 
      {createEdgeNeon(edgePoints[1], edgePoints[2])}
      {createEdgeNeon(edgePoints[2], edgePoints[3])}
      {createEdgeNeon(edgePoints[3], edgePoints[0])}

      {createWall([0, 0, -halfDepth], 10, wallHeight, 0.1)} // Front wall
      {createWall([0, 0, halfDepth], 10, wallHeight, 0.1)} // Back wall
      {createWall([-halfWidth, 0, 0], 0.1, wallHeight, 10)} // Left wall
      {createWall([halfWidth, 0, 0], 0.1, wallHeight, 10)} // Right wall
      <OrbitControls />
        <Speaker position={[-halfDepth + 1, -1, -halfDepth + 1]} />
        <Speaker2 position={[-halfDepth + 1, -1, - halfDepth / 2]} />
        <DJGear position={[- halfDepth / 2 + 0.5, 0, - halfDepth + 1.4]} />
        <Table position={[- halfDepth / 2 + 0.5, -0.4, - halfDepth + 1.4]} />
        <EffectComposer>
  <Bloom 
    intensity={1}            // Controls overall brightness of bloom (increase if needed)
    luminanceThreshold={0.0} // Ensures bloom applies even to the darkest lights
    luminanceSmoothing={2} // Blurs the effect for a softer look
    mipmapBlur={true}  
          // Enables mipmap blur for smoother glow
    radius={0.8}               // Makes the bloom spread out more
  />
</EffectComposer>
    </Canvas>
  );
};