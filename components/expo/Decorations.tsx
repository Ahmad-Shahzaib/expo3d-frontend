import { Text, Float } from "@react-three/drei";

export default function Decorations() {
    return (
        <group>
            {/* Hanging Banners */}
            <group position={[0, 8, -15]}>
                <mesh>
                    <boxGeometry args={[8, 2, 0.1]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                {/* <Text
                    position={[0, 0, 0.06]}
                    fontSize={0.8}
                    color="#4fd1c5"
                    anchorX="center"
                    anchorY="middle"
                >
                    WELCOME TO EXPO 2025
                </Text> */}
                {/* Back side text */}
                {/* <Text
                    position={[0, 0, -0.06]}
                    rotation={[0, Math.PI, 0]}
                    fontSize={0.8}
                    color="#4fd1c5"
                    anchorX="center"
                    anchorY="middle"
                >
                    THANK YOU FOR VISITING
                </Text> */}
            </group>

            {/* Central Seating Area */}
            <group position={[0, 0, -15]}>
                {/* Bench 1 */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[4, 0.5, 1.5]} />
                    <meshStandardMaterial color="#333" roughness={0.5} />
                </mesh>
                {/* Glowing strip under bench */}
                <mesh position={[0, 0.1, 0]}>
                    <boxGeometry args={[3.8, 0.1, 1.3]} />
                    <meshBasicMaterial color="#00ffff" />
                </mesh>
            </group>

            {/* Floor Arrows */}
            <group position={[0, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh>
                    <circleGeometry args={[0.5, 32]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
                </mesh>
                <mesh position={[0, 1, 0]}>
                    <circleGeometry args={[0.3, 32]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
                </mesh>
            </group>

            <group position={[0, 0.01, -10]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh>
                    <circleGeometry args={[0.5, 32]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
                </mesh>
            </group>

            <group position={[0, 0.01, -20]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh>
                    <circleGeometry args={[0.5, 32]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
                </mesh>
            </group>

        </group>
    );
}
