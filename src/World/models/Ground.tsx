import { useLoader } from "@react-three/fiber";
import { BASE } from "../../constants";
import { Color, DataTexture, LuminanceFormat, RepeatWrapping, TextureLoader } from "three";

function generateNoiseTexture(width: number, height: number) {
  const size = width * height;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 255;
  }
  const texture = new DataTexture(data, width, height, LuminanceFormat);
  texture.needsUpdate = true;
  return texture;
}


export function Ground(){
     const groundTexture = useLoader(TextureLoader, `${BASE}ground.jpg`);
     const noiseTexture = generateNoiseTexture(1, 1);

       groundTexture.wrapS = RepeatWrapping;
       groundTexture.wrapT = RepeatWrapping;

       const groundRepeatX = 10;
       const groudRepeatY = 10;
       groundTexture.repeat.set(groundRepeatX, groudRepeatY);

    return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshPhongMaterial map={groundTexture} color={new Color().setHex(0x999922)} alphaMap={noiseTexture} />
    </mesh>
}