import { Environment, MeshReflectorMaterial, Text } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { extend, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import Elevator from "./Elevator";
import ReceptionDesk from "./ReceptionDesk";

// Register the uniforms lib
extend({ RectAreaLightUniformsLib });

export default function HallStructure() {
    const { gl } = useThree();

    useEffect(() => {
        RectAreaLightUniformsLib.init();
    }, [gl]);

    // Dimensions
    const HALL_WIDTH = 64;
    const HALL_HEIGHT = 22;
    const FLOOR_2_Y = 7.5;

    // Z-Coordinates
    const Z_START = 22;
    const Z_END = -75;

    return (
        <>
            {/* --- LIGHTING & ATMOSPHERE --- */}
            <ambientLight intensity={0.7} />
            <fog attach="fog" args={['#101010', 5, 100]} />
            <Environment preset="city" blur={0.8} />

            {/* --- MAIN STRUCTURE --- */}

            {/* Floor (Ground) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[HALL_WIDTH, 200]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={512}
                    mixBlur={1}
                    mixStrength={30}
                    roughness={0.4}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#1a1a1a"
                    metalness={0.5}
                    mirror={0}
                />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, HALL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[HALL_WIDTH, 200]} />
                <meshStandardMaterial color="#222" roughness={0.9} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-HALL_WIDTH / 2, HALL_HEIGHT / 2, 0]}>
                <boxGeometry args={[1, HALL_HEIGHT, 220]} />
                <meshStandardMaterial color="#e5e5e5" />
            </mesh>
            {/* Right Wall */}
            <mesh position={[HALL_WIDTH / 2, HALL_HEIGHT / 2, 0]}>
                <boxGeometry args={[1, HALL_HEIGHT, 220]} />
                <meshStandardMaterial color="#e5e5e5" />
            </mesh>
            {/* Back Wall (Entrance) */}
            <mesh position={[0, HALL_HEIGHT / 2, Z_START]}>
                <boxGeometry args={[HALL_WIDTH, HALL_HEIGHT, 1]} />
                <meshStandardMaterial color="#d4d4d4" />
            </mesh>
            {/* Front Wall (Far End) */}
            <mesh position={[0, HALL_HEIGHT / 2, Z_END]}>
                <boxGeometry args={[HALL_WIDTH, HALL_HEIGHT, 1]} />
                <meshStandardMaterial color="#d4d4d4" />
            </mesh>


            {/* --- LEVEL 2 (MEZZANINE) --- */}
            {/* Side Walkways */}
            <group position={[0, FLOOR_2_Y, 0]}>
                {/* Left Balcony (Width 12) */}
                <mesh position={[-(HALL_WIDTH / 2) + 6, -0.25, -20]} receiveShadow>
                    <boxGeometry args={[12, 0.5, 120]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
                </mesh>
                {/* Right Balcony (Width 12) */}
                <mesh position={[(HALL_WIDTH / 2) - 6, -0.25, -20]} receiveShadow>
                    <boxGeometry args={[12, 0.5, 120]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
                </mesh>

                {/* Connecting Bridge (Far End) - connect at Z=-60 */}
                <mesh position={[0, -0.25, -55]}>
                    <boxGeometry args={[HALL_WIDTH - 2, 0.5, 10]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
                </mesh>

                {/* Glass Railings */}
                {/* Left Inner Rail */}
                <mesh position={[-(HALL_WIDTH / 2) + 12.1, 1, -20]}>
                    <boxGeometry args={[0.1, 2, 120]} />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.3}
                        roughness={0}
                        metalness={0.9}
                        color="#aaccff"
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Right Inner Rail */}
                <mesh position={[(HALL_WIDTH / 2) - 12.1, 1, -20]}>
                    <boxGeometry args={[0.1, 2, 120]} />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.3}
                        roughness={0}
                        metalness={0.9}
                        color="#aaccff"
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Bridge Rail (Front) */}
                <mesh position={[0, 1, -50]}>
                    <boxGeometry args={[HALL_WIDTH - 24, 2, 0.1]} />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.3}
                        roughness={0}
                        metalness={0.9}
                        color="#aaccff"
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>


            {/* --- ELEVATOR --- */}
            {/* Placed at X=-23 to align where escalator adjacent zone was */}
            <Elevator position={[-21, 0, -4]} />

            {/* Elevator Shaft / Glass Tower */}
            <group position={[-21, HALL_HEIGHT / 2, -4]}>
                <mesh>
                    <boxGeometry args={[3.2, HALL_HEIGHT, 3.2]} />
                    <meshPhysicalMaterial
                        color="#ccffff"
                        transparent
                        opacity={0.15}
                        roughness={0}
                        metalness={0.1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <mesh>
                    {/* Frame */}
                    <boxGeometry args={[3.3, HALL_HEIGHT, 3.3]} />
                    <meshStandardMaterial wireframe color="#555" opacity={0.1} transparent />
                </mesh>
            </group>


            {/* --- RECEPTION & SIGNAGE --- */}
            {/* Reception Desk */}

            {/* <ReceptionDesk /> */}

            {/* Floor Signs */}
            <Text position={[-28, FLOOR_2_Y + 3, -10]} rotation={[0, Math.PI / 2, 0]} fontSize={1.5} color="#fff">
                LEVEL 1
            </Text>
            <Text position={[28, FLOOR_2_Y + 3, -10]} rotation={[0, -Math.PI / 2, 0]} fontSize={1.5} color="#fff">
                LEVEL 1
            </Text>

            <Text position={[0, 5, -25]} rotation={[0, Math.PI, 0]} fontSize={1} color="#888">
                GROUND FLOOR - MAIN HALL
            </Text>


            {/* --- LIGHTS --- */}
            {Array.from({ length: 8 }).map((_, i) => {
                const z = 10 - i * 12;
                return (
                    <group key={`light-${i}`} position={[0, HALL_HEIGHT - 1, z]}>
                        <rectAreaLight width={40} height={1} intensity={12} color="#fff" rotation={[-Math.PI / 2, 0, 0]} />
                    </group>
                )
            })}

        </>
    );
}
