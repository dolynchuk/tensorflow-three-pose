type Props = {
    halfDepth: number;
};

export function Spotlights({halfDepth}: Props){
    return <>
         <spotLight 
              position={[0, 5, 0]} 
              angle={Math.PI / 6}
              penumbra={0.3}
              intensity={50}      
              distance={10}
              castShadow={true}
              color={0x00ffff}
              target-position={[0, 0, 0]}
            />
             <spotLight 
                position={[- halfDepth / 2 + 0.5, 5, - halfDepth + 1.4]}
                angle={Math.PI / 4}
                penumbra={0.5}
                intensity={50}
                distance={20}
                castShadow={true}
                color={0xff88ff}
                target-position={[- halfDepth / 2 + 0.5, 0, - halfDepth + 1.4]}
              /></>
}