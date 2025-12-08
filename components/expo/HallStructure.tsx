import { Environment, MeshReflectorMaterial } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { extend, useThree } from "@react-three/fiber";
import { useEffect } from "react";

// Register the uniforms lib
extend({ RectAreaLightUniformsLib });

export default function HallStructure() {
    const { gl } = useThree();

    useEffect(() => {
        RectAreaLightUniformsLib.init();
    }, [gl]);

    return (
        <>
            {/* Main Ambient Lighting */}
            <ambientLight intensity={0.5} />

            {/* Industrial Ceiling Structure */}
            {Array.from({ length: 20 }).map((_, i) => {
                const z = (i - 10) * 10;
                return (
                    <group key={`beam-${i}`} position={[0, 12, z]}>
                        {/* Main Beam */}
                        <mesh position={[0, 1, 0]}>
                            <boxGeometry args={[200, 2, 1]} />
                            <meshStandardMaterial color="#202020" roughness={0.7} metalness={0.5} />
                        </mesh>

                        {/* Light Fixture Housing */}
                        <mesh position={[0, -0.1, 0]}>
                            <boxGeometry args={[200, 0.2, 0.8]} />
                            <meshStandardMaterial color="#101010" />
                        </mesh>

                        {/* Emissive LED Strip (Visual) */}
                        <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[200, 0.6]} />
                            <meshBasicMaterial color="#e0f7fa" toneMapped={false} />
                        </mesh>

                        {/* Actual Light Source */}
                        <rectAreaLight
                            width={200}
                            height={0.6}
                            intensity={20}
                            color="#e0f7fa"
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, -0.3, 0]}
                        />
                    </group>
                );
            })}

            {/* Cross Beams for Detail */}
            {Array.from({ length: 10 }).map((_, i) => {
                const x = (i - 5) * 20;
                return (
                    <mesh key={`cross-${i}`} position={[x, 14, 0]}>
                        <boxGeometry args={[1, 1, 200]} />
                        <meshStandardMaterial color="#151515" roughness={0.8} />
                    </mesh>
                );
            })}

            {/* Volumetric-like Fog */}
            <fog attach="fog" args={['#050505', 5, 70]} />

            {/* Floor with High Quality Reflection */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <MeshReflectorMaterial
                    blur={[400, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={0.4}
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#151515"
                    metalness={0.6}
                    mirror={0} // ✅ Added mirror prop to fix TS error
                />
            </mesh>

            {/* Ceiling Structure */}
            <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>

            {/* Environment Map for realistic reflections on booths */}
            <Environment preset="night" blur={0.6} />
        </>
    );
}
