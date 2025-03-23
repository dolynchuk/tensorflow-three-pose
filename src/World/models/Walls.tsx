import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import { BASE } from "../../constants";

const wallHeight = 2; 
const wallRepeatX = 6;
const wallRepeatY = 2;

type Props = {
    halfDepth: number;
    halfWidth: number;
}

export function Walls({halfDepth, halfWidth}: Props){
    const wallColorTexture = useLoader(TextureLoader, `${BASE}wall_Color.jpg`);
    const wallAoTexture = useLoader(TextureLoader, `${BASE}wall_AmbientOcclusion.jpg`);
    const wallDisplacementTexture = useLoader(TextureLoader, `${BASE}wall_Displacement.jpg`);
    const wallRoughnessTexture = useLoader(TextureLoader, `${BASE}wall_Roughness.jpg`);
    const wallNormalTexture = useLoader(TextureLoader, `${BASE}wall_Normal.jpg`);

    wallColorTexture.repeat.set(wallRepeatX, wallRepeatY);
    wallAoTexture.repeat.set(wallRepeatX, wallRepeatY);
    wallDisplacementTexture.repeat.set(wallRepeatX, wallRepeatY);
    wallRoughnessTexture.repeat.set(wallRepeatX, wallRepeatY);
    wallNormalTexture.repeat.set(wallRepeatX, wallRepeatY);

    wallColorTexture.wrapS = wallColorTexture.wrapT = RepeatWrapping;
    wallAoTexture.wrapS = wallAoTexture.wrapT = RepeatWrapping;
    wallDisplacementTexture.wrapS = wallDisplacementTexture.wrapT = RepeatWrapping;
    wallRoughnessTexture.wrapS = wallRoughnessTexture.wrapT = RepeatWrapping;
    wallNormalTexture.wrapS = wallNormalTexture.wrapT = RepeatWrapping;

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


    return <>
          {createWall([0, 0, -halfDepth], 10, wallHeight, 0.1)} // Front wall
        {createWall([0, 0, halfDepth], 10, wallHeight, 0.1)} // Back wall
        {createWall([-halfWidth, 0, 0], 0.1, wallHeight, 10)} // Left wall
        {createWall([halfWidth, 0, 0], 0.1, wallHeight, 10)} // Right wall
    </>
}