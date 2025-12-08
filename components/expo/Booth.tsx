import { Text, Float } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface BoothProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    companyName: string;
    color: string;
    onClick: () => void;
    boothData?: any;
}

export default function Booth({ position, rotation = [0, 0, 0], companyName, color, onClick, boothData }: BoothProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Change cursor when hovering
    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    // Create a custom shape for the Arch
    const archShape = useMemo(() => {
        const shape = new THREE.Shape();
        const width = 6;
        const height = 5;
        const thickness = 0.8;
        const radius = 1.0;

        // Outer rectangle with rounded corners
        shape.moveTo(-width / 2, 0);
        shape.lineTo(-width / 2, height - radius);
        shape.quadraticCurveTo(-width / 2, height, -width / 2 + radius, height);
        shape.lineTo(width / 2 - radius, height);
        shape.quadraticCurveTo(width / 2, height, width / 2, height - radius);
        shape.lineTo(width / 2, 0);

        // Inner rectangle (hole)
        const hole = new THREE.Path();
        hole.moveTo(-width / 2 + thickness, 0);
        hole.lineTo(-width / 2 + thickness, height - thickness - radius);
        hole.quadraticCurveTo(-width / 2 + thickness, height - thickness, -width / 2 + thickness + radius, height - thickness);
        hole.lineTo(width / 2 - thickness - radius, height - thickness);
        hole.quadraticCurveTo(width / 2 - thickness, height - thickness, width / 2 - thickness, height - thickness - radius);
        hole.lineTo(width / 2 - thickness, 0);

        shape.holes.push(hole);
        return shape;
    }, []);

    const extrudeSettings = {
        depth: 4, // Depth of the booth
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };

    return (
        <group
            ref={groupRef}
            position={position}
            rotation={rotation}
            userData={{ isBooth: true, boothData }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* The Main Arch Structure */}
            <mesh position={[0, 0, 0]}>
                <extrudeGeometry args={[archShape, extrudeSettings]} />
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Glowing Inner Edge (Simulated with a slightly smaller tube or manual placement) */}
            {/* We can use a tube following the inner path, but for simplicity let's use a separate mesh for the glow strip inside the arch */}
            <mesh position={[0, 4.1, 2]} rotation={[0, 0, 0]}>
                <boxGeometry args={[4.4, 0.1, 4]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : color}
                    emissive={hovered ? "#ffffff" : color}
                    emissiveIntensity={hovered ? 3 : 1}
                    toneMapped={false}
                />
            </mesh>

            {/* Side Glow Strips */}
            <mesh position={[-2.2, 2, 2]}>
                <boxGeometry args={[0.1, 4, 4]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : color}
                    emissive={hovered ? "#ffffff" : color}
                    emissiveIntensity={hovered ? 3 : 1}
                    toneMapped={false}
                />
            </mesh>
            <mesh position={[2.2, 2, 2]}>
                <boxGeometry args={[0.1, 4, 4]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : color}
                    emissive={hovered ? "#ffffff" : color}
                    emissiveIntensity={hovered ? 3 : 1}
                    toneMapped={false}
                />
            </mesh>

            {/* Company Name on Top */}
            <group position={[0, 5.2, 2]}>
                <Text
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000"
                >
                    {companyName}
                </Text>
            </group>

            {/* Interior Furniture */}

            {/* Info Kiosk */}
            <group position={[1.5, 0, 1]}>
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[0.8, 2, 0.5]} />
                    <meshStandardMaterial color="#222" roughness={0.2} />
                </mesh>
                {/* Screen */}
                <mesh position={[0, 1.5, 0.26]} rotation={[-0.2, 0, 0]}>
                    <planeGeometry args={[0.6, 0.4]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            </group>

            {/* Table and Chairs */}
            <group position={[-1, 0, 1]}>
                <mesh position={[0, 0.8, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.1, 0.8, 32]} />
                    <meshStandardMaterial color="#888" />
                </mesh>
            </group>

            {/* Hologram in Center */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group position={[0, 2, 2]}>
                    <mesh>
                        <icosahedronGeometry args={[0.4, 0]} />
                        <meshStandardMaterial
                            color={color}
                            wireframe
                            emissive={color}
                            emissiveIntensity={2}
                        />
                    </mesh>
                </group>
            </Float>

            {/* Floor Plate for Booth Area */}
            <mesh position={[0, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[5.5, 5]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>

        </group>
    );
}
