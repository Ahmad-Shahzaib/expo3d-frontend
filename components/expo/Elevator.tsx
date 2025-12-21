import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useExpo, FLOOR_HEIGHTS } from "./ExpoContext";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";

export default function Elevator({ position }: { position: [number, number, number] }) {
    const { elevatorRef } = useExpo();
    const groupRef = useRef<THREE.Group>(null);
    const doorLeftRef = useRef<THREE.Mesh>(null);
    const doorRightRef = useRef<THREE.Mesh>(null);

    // Logic Constants
    const SPEED = 2.5;
    const DOOR_SPEED = 2.0;

    const [activeButton, setActiveButton] = useState<number | null>(null);

    useFrame((state, delta) => {
        const ref = elevatorRef.current;
        const dt = Math.min(delta, 0.1);

        // Update Position Visuals
        if (groupRef.current) {
            groupRef.current.position.set(position[0], ref.y, position[2]);
        }

        // --- Logic Machine ---

        // 1. Check Button Requests
        if (ref.status === 'idle') {
            // If target different from current, start sequence
            if (ref.targetFloor !== ref.currentFloor) {
                ref.status = 'door_action'; // Start closing
            } else {
                // Ensure doors are open
                if (ref.doorOpenness < 1) {
                    ref.doorOpenness = Math.min(ref.doorOpenness + DOOR_SPEED * dt, 1);
                }
            }
        }

        else if (ref.status === 'door_action') {
            // Determine if we are closing (to move) or opening (arrived)
            const movingStart = (ref.y !== FLOOR_HEIGHTS[ref.targetFloor]);

            if (movingStart) {
                // We need to CLOSE doors first
                if (ref.doorOpenness > 0) {
                    ref.doorOpenness = Math.max(ref.doorOpenness - DOOR_SPEED * dt, 0);
                } else {
                    // Doors closed, start moving
                    ref.status = 'moving';
                }
            } else {
                // We have Arrived (or are already there), OPEN doors
                if (ref.doorOpenness < 1) {
                    ref.doorOpenness = Math.min(ref.doorOpenness + DOOR_SPEED * dt, 1);
                } else {
                    // Fully open, back to idle
                    ref.currentFloor = ref.targetFloor;
                    ref.status = 'idle';
                    setActiveButton(null);
                }
            }
        }

        else if (ref.status === 'moving') {
            const targetY = FLOOR_HEIGHTS[ref.targetFloor];
            const diff = targetY - ref.y;
            const dir = Math.sign(diff);

            if (Math.abs(diff) < 0.05) {
                // Arrived
                ref.y = targetY;
                ref.status = 'door_action'; // Now open doors
            } else {
                ref.y += dir * SPEED * dt;
            }
        }

        // Animate Doors
        if (doorLeftRef.current && doorRightRef.current) {
            const offset = ref.doorOpenness * 0.9; // 0.9 = max width
            doorLeftRef.current.position.x = -0.5 - offset;
            doorRightRef.current.position.x = 0.5 + offset;
        }

        // Update Text Color/Active Button
        // (Handled via React State for buttons, but 'activeButton' drives it)
    });

    const callFloor = (floorIndex: number) => {
        const ref = elevatorRef.current;
        if (ref.status === 'idle' || ref.status === 'door_action') {
            ref.targetFloor = floorIndex;
            setActiveButton(floorIndex);
            // If we are idle at the SAME floor, re-trigger door open used in logic, 
            // but logic handles 'target==current' by ensuring open.
        }
    };

    return (
        <group ref={groupRef} position={position}>
            {/* -- CABIN STRUCTURE -- */}
            {/* Floor */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.5, 2.5]} />
                <meshStandardMaterial color="#333" roughness={0.5} />
            </mesh>
            {/* Ceiling */}
            <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.5, 2.5]} />
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
            </mesh>
            {/* Back Wall (Glass) */}
            <mesh position={[0, 1.25, -1.25]}>
                <boxGeometry args={[2.5, 2.5, 0.1]} />
                <meshPhysicalMaterial color="#88ddff" roughness={0} metalness={0.1} transmission={0.5} thickness={0.5} />
            </mesh>
            {/* Side Walls (Metallic) */}
            <mesh position={[-1.25, 1.25, 0]}>
                <boxGeometry args={[0.1, 2.5, 2.5]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[1.25, 1.25, 0]}>
                <boxGeometry args={[0.1, 2.5, 2.5]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Front Frame */}
            <mesh position={[-1, 1.25, 1.25]}>
                <boxGeometry args={[0.5, 2.5, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[1, 1.25, 1.25]}>
                <boxGeometry args={[0.5, 2.5, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0, 2.35, 1.25]}>
                <boxGeometry args={[2.5, 0.3, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>


            {/* -- DOORS -- */}
            <mesh ref={doorLeftRef} position={[-0.5, 1.1, 1.25]}>
                <boxGeometry args={[0.9, 2.2, 0.05]} />
                <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh ref={doorRightRef} position={[0.5, 1.1, 1.25]}>
                <boxGeometry args={[0.9, 2.2, 0.05]} />
                <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.3} />
            </mesh>


            {/* -- UI PANEL (Inside Right Wall) -- */}
            <group position={[1.18, 1.4, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh>
                    <boxGeometry args={[0.4, 0.6, 0.02]} />
                    <meshStandardMaterial color="#111" />
                </mesh>

                {/* Floor Display */}
                <mesh position={[0, 0.2, 0.02]}>
                    <planeGeometry args={[0.3, 0.15]} />
                    <meshBasicMaterial color="#000" />
                </mesh>
                {/* We need a dynamic texture for floor number, or just conditional rendering */}
                <CurrentFloorDisplay />

                {/* Buttons */}
                {/* G */}
                <mesh position={[0, 0, 0.02]} onClick={() => callFloor(0)}>
                    <circleGeometry args={[0.06, 32]} />
                    <meshStandardMaterial color="#333" emissive={activeButton === 0 ? "orange" : "#000"} />
                </mesh>
                <Text position={[0, 0, 0.03]} fontSize={0.06} color="white">G</Text>

                {/* 1 */}
                <mesh position={[0, -0.15, 0.02]} onClick={() => callFloor(1)}>
                    <circleGeometry args={[0.06, 32]} />
                    <meshStandardMaterial color="#333" emissive={activeButton === 1 ? "orange" : "#000"} />
                </mesh>
                <Text position={[0, -0.15, 0.03]} fontSize={0.06} color="white">1</Text>
            </group>

            {/* -- SIGNAGE -- */}
            {/* Above Door Outside - This moves with elevator which is realistic for 'On Car' displays, 
                BUT usually floor indicators are on the wall outside. 
                For simplicity, let's put a sign on the car frame. */}
            <group position={[0, 2.35, 1.31]}>
                <CurrentFloorDisplayBig />
            </group>

        </group>
    );
}

function CurrentFloorDisplay() {
    const { elevatorRef } = useExpo();
    const [display, setDisplay] = useState("G");
    const lastUpdate = useRef(0);

    useFrame(({ clock }) => {
        if (clock.elapsedTime - lastUpdate.current > 0.2) {
            lastUpdate.current = clock.elapsedTime;
            const y = elevatorRef.current.y;
            const floor = y > 3 ? "1" : "G";
            if (floor !== display) setDisplay(floor);
        }
    });

    return (
        <Text position={[0, 0.2, 0.03]} fontSize={0.1} color="red">
            {display}
        </Text>
    )
}

function CurrentFloorDisplayBig() {
    const { elevatorRef } = useExpo();
    const [display, setDisplay] = useState("G");
    const lastUpdate = useRef(0);

    useFrame(({ clock }) => {
        if (clock.elapsedTime - lastUpdate.current > 0.2) {
            lastUpdate.current = clock.elapsedTime;
            const y = elevatorRef.current.y;
            const floor = y > 3 ? "1" : "G";
            if (floor !== display) setDisplay(floor);
        }
    });

    return (
        <Text fontSize={0.2} color="red">
            {display}
        </Text>
    )
}
