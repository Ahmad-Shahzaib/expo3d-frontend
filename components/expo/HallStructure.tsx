import { Environment, MeshReflectorMaterial, Text } from "@react-three/drei";
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

    // Dimensions
    const HALL_WIDTH = 44; // Walls at +/- 22
    const HALL_LENGTH = 80;
    const HALL_HEIGHT = 12;
    const Z_START = 15;
    const Z_END = -65;
    const Z_CENTER = (Z_START + Z_END) / 2;

    return (
        <>
            {/* Main Ambient Lighting */}
            <ambientLight intensity={0.6} />

            {/* --- WALLS --- */}

            {/* Left Wall */}
            <mesh position={[-HALL_WIDTH / 2, HALL_HEIGHT / 2, Z_CENTER]}>
                <boxGeometry args={[1, HALL_HEIGHT, HALL_LENGTH]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.8} />
            </mesh>
            {/* Right Wall */}
            <mesh position={[HALL_WIDTH / 2, HALL_HEIGHT / 2, Z_CENTER]}>
                <boxGeometry args={[1, HALL_HEIGHT, HALL_LENGTH]} />
                <meshStandardMaterial color="#e5e5e5" roughness={0.8} />
            </mesh>
            {/* Back Wall (Entrance) */}
            <mesh position={[0, HALL_HEIGHT / 2, Z_START]}>
                <boxGeometry args={[HALL_WIDTH, HALL_HEIGHT, 1]} />
                <meshStandardMaterial color="#d4d4d4" roughness={0.8} />
            </mesh>
            {/* Front Wall (Far End) */}
            <mesh position={[0, HALL_HEIGHT / 2, Z_END]}>
                <boxGeometry args={[HALL_WIDTH, HALL_HEIGHT, 1]} />
                <meshStandardMaterial color="#d4d4d4" roughness={0.8} />
            </mesh>

            {/* --- PILLARS & DETAILS --- */}
            {[-10, -35, -55].map((z, i) => (
                <group key={`pillars-${i}`}>
                    {/* Left Pillar */}
                    <mesh position={[-HALL_WIDTH / 2 + 1, HALL_HEIGHT / 2, z]}>
                        <boxGeometry args={[2, HALL_HEIGHT, 2]} />
                        <meshStandardMaterial color="#333" roughness={0.5} />
                    </mesh>
                    {/* Right Pillar */}
                    <mesh position={[HALL_WIDTH / 2 - 1, HALL_HEIGHT / 2, z]}>
                        <boxGeometry args={[2, HALL_HEIGHT, 2]} />
                        <meshStandardMaterial color="#333" roughness={0.5} />
                    </mesh>
                </group>
            ))}

            {/* --- SIGNAGE --- */}
            <group position={[-HALL_WIDTH / 2 + 0.6, 5, -5]} rotation={[0, Math.PI / 2, 0]}>
                <Text
                    fontSize={1.5}
                    color="#333"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#fff"
                >
                    Innovation Hall A
                </Text>
            </group>

            <group position={[HALL_WIDTH / 2 - 0.6, 5, -5]} rotation={[0, -Math.PI / 2, 0]}>
                <Text
                    fontSize={1.5}
                    color="#333"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#fff"
                >
                    Tech Zone
                </Text>
            </group>

            {/* Entrance Signage */}
            <group position={[0, 8, Z_START - 0.6]} rotation={[0, Math.PI, 0]}>
                <Text
                    fontSize={2}
                    color="#111"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    WELCOME TO VEX EXPO 2024
                </Text>
            </group>


            {/* --- CEILING BEAMS --- */}
            {Array.from({ length: 10 }).map((_, i) => {
                const z = Z_START - (i * 8); // Spaced beams
                return (
                    <group key={`beam-${i}`} position={[0, HALL_HEIGHT, z]}>
                        {/* Cross Beam */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[HALL_WIDTH, 1, 1]} />
                            <meshStandardMaterial color="#202020" roughness={0.7} metalness={0.5} />
                        </mesh>
                        {/* Light Source */}
                        <rectAreaLight
                            width={HALL_WIDTH - 4}
                            height={0.5}
                            intensity={15}
                            color="#e0f7fa"
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, -0.6, 0]}
                        />
                        <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[HALL_WIDTH - 4, 0.5]} />
                            <meshBasicMaterial color="#e0f7fa" toneMapped={false} />
                        </mesh>
                    </group>
                );
            })}

            {/* Volumetric Fog */}
            <fog attach="fog" args={['#101010', 5, 90]} />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, Z_CENTER]}>
                <planeGeometry args={[HALL_WIDTH, HALL_LENGTH]} />
                <MeshReflectorMaterial
                    blur={[400, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={30}
                    roughness={0.5}
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#252525"
                    metalness={0.4}
                    mirror={0}
                />
            </mesh>

            {/* Ceiling Plane */}
            <mesh position={[0, HALL_HEIGHT + 0.5, Z_CENTER]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[HALL_WIDTH, HALL_LENGTH]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>

            {/* Environment Map */}
            <Environment preset="city" blur={0.8} />
        </>
    );
}
