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

            {/* Ceiling Grid Lights */}
            {Array.from({ length: 5 }).map((_, x) =>
                Array.from({ length: 5 }).map((_, z) => (
                    <group key={`${x}-${z}`} position={[(x - 2) * 20, 10, (z - 2) * 20]}>
                        {/* Visual Light Fixture */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[12, 0.5]} />
                            <meshBasicMaterial color="#ffffff" toneMapped={false} />
                        </mesh>
                        {/* Actual Light Source */}
                        <rectAreaLight
                            width={12}
                            height={0.5}
                            intensity={50} // Increased intensity for realism
                            color="#ffffff"
                            rotation={[-Math.PI / 2, 0, 0]}
                        />
                    </group>
                ))
            )}

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
