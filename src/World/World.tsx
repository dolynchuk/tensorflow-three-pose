import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import './styles.css';
import { Speaker } from "./models/Speaker";
import { Speaker2 } from "./models/Speaker2";
import { Player } from "./models/Player";
import { EdgeNeon } from "./models/EdgeNeon";
import { Ground } from "./models/Ground";
import { WALL_HEIGHT, Walls } from "./models/Walls";
import { DJGear } from "./models/DJGear";
import { Table } from "./models/Table";
import { Spotlights } from "./models/Spotlights";

const halfWidth = 10 / 2;
const halfDepth = 10 / 2;
const speakerPosition = [-0.5, -1, -halfDepth + 1];
const skeaker2Position = [-halfDepth + 1, -1, - halfDepth / 2];
const djGearPosition = [- halfDepth / 2 + 0.5, 0, - halfDepth + 1.8];
const tablePosition = [- halfDepth / 2 + 0.5, -0.4, - halfDepth + 1.8];

export function World() {


  return (
    <Canvas className="canvas" camera={{ position: [5, 1, 5], fov: 20 }}>
        <ambientLight intensity={0.2} />
        <Spotlights halfDepth={halfDepth} />
        <color attach="background" args={["black"]} />
        <Ground />
      <Player />
      <EdgeNeon halfWidth={halfWidth} halfDepth={halfDepth} yPosition={WALL_HEIGHT - 1} />
      <Walls halfWidth={halfWidth} halfDepth={halfDepth} />
      <OrbitControls />
        <Speaker position={speakerPosition} />
        <Speaker2 position={skeaker2Position} />
        <DJGear position={djGearPosition} />
        <Table position={tablePosition} />
    </Canvas>
  );
};