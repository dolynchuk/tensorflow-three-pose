import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import './styles.css';
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Speaker } from "./models/Speaker";
import { Speaker2 } from "./models/Speaker2";
import { Player } from "./models/Player";
import { EdgeNeon } from "./models/EdgeNeon";
import { Ground } from "./models/Ground";
import { Walls } from "./models/Walls";
import { DJGear } from "./models/DJGear";
import { Table } from "./models/Table";
import { Spotlights } from "./models/Spotlights";

export function World() {
  const halfWidth = 10 / 2;
  const halfDepth = 10 / 2;

  return (
    <Canvas className="canvas" camera={{ position: [5, 1, 5], fov: 20 }}>
       <Bloom mipmapBlur luminanceThreshold={0.1} intensity={10} radius={0.8} />
        <ambientLight intensity={0.1} />
        <Spotlights halfDepth={halfDepth} />
        <color attach="background" args={["black"]} />
        <Ground />
      <Player />
      <EdgeNeon halfWidth={halfWidth} halfDepth={halfDepth} yPosition={1.05} />
      <Walls halfWidth={halfWidth} halfDepth={halfDepth} />
      <OrbitControls />
        <Speaker position={[-halfDepth + 1, -1, -halfDepth + 1]} />
        <Speaker2 position={[-halfDepth + 1, -1, - halfDepth / 2]} />
        <DJGear position={[- halfDepth / 2 + 0.5, 0, - halfDepth + 1.4]} />
        <Table position={[- halfDepth / 2 + 0.5, -0.4, - halfDepth + 1.4]} />
        <EffectComposer>
          <Bloom 
            intensity={1} 
            luminanceThreshold={0.0}
            luminanceSmoothing={2}
            mipmapBlur={true}  
            radius={0.8}
          />
        </EffectComposer>
    </Canvas>
  );
};