import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";
import { useExpo } from "./ExpoContext";

// Define booth bounding boxes for collision
const OBSTACLES = [
    // Left Side Booths
    { xMin: -14.5, xMax: -9.5, zMin: -8.5, zMax: -1.5 },   // Booth 1
    { xMin: -14.5, xMax: -9.5, zMin: -28.5, zMax: -21.5 }, // Booth 2
    { xMin: -14.5, xMax: -9.5, zMin: -48.5, zMax: -41.5 }, // Booth 3

    // Right Side Booths
    { xMin: 9.5, xMax: 14.5, zMin: -8.5, zMax: -1.5 },     // Booth 4
    { xMin: 9.5, xMax: 14.5, zMin: -28.5, zMax: -21.5 },   // Booth 5
    { xMin: 9.5, xMax: 14.5, zMin: -48.5, zMax: -41.5 },   // Booth 6

    // Reception Desk Area
    { xMin: -4, xMax: 4, zMin: 12, zMax: 18 },

    // Elevator Walls (Center -21, 0, -4)
    // Back Wall
    { xMin: -22.5, xMax: -19.5, zMin: -5.5, zMax: -5.0 },
    // Left Wall
    { xMin: -22.5, xMax: -22.0, zMin: -5.5, zMax: -2.5 },
    // Right Wall
    { xMin: -20.0, xMax: -19.5, zMin: -5.5, zMax: -2.5 },
];

function isColliding(x: number, z: number) {
    for (const obs of OBSTACLES) {
        if (x >= obs.xMin && x <= obs.xMax && z >= obs.zMin && z <= obs.zMax) {
            return true;
        }
    }
    return false;
}

const PLAYER_HEIGHT = 1.7;
const _vecForward = new THREE.Vector3();
const _vecRight = new THREE.Vector3();
const _vecUp = new THREE.Vector3(0, 1, 0);

export default function PlayerControls() {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const { elevatorRef } = useExpo();

    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        run: false
    });

    const velocity = useRef(new THREE.Vector3());

    // Physics
    const WALK_SPEED = 6;
    const RUN_SPEED = 12;
    const DAMPING = 8; // Slightly looser for game-feel

    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.lock();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': keys.current.forward = true; break;
                case 'KeyS': case 'ArrowDown': keys.current.backward = true; break;
                case 'KeyA': case 'ArrowLeft': keys.current.left = true; break;
                case 'KeyD': case 'ArrowRight': keys.current.right = true; break;
                case 'ShiftLeft': case 'ShiftRight': keys.current.run = true; break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': keys.current.forward = false; break;
                case 'KeyS': case 'ArrowDown': keys.current.backward = false; break;
                case 'KeyA': case 'ArrowLeft': keys.current.left = false; break;
                case 'KeyD': case 'ArrowRight': keys.current.right = false; break;
                case 'ShiftLeft': case 'ShiftRight': keys.current.run = false; break;
            }
        };

        const resetKeys = () => {
            keys.current = { forward: false, backward: false, left: false, right: false, run: false };
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', resetKeys);
        document.addEventListener('visibilitychange', () => { if (document.hidden) resetKeys(); });

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', resetKeys);
        };
    }, []);

    useFrame((_, delta) => {
        if (!controlsRef.current?.isLocked) {
            velocity.current.set(0, 0, 0);
            return;
        }

        const dt = Math.min(delta, 0.1);
        const { x, y, z } = camera.position;

        // --- Elevator Logic ---
        // Bounds for Elevator Cabin (centered at -21, ?, -4).
        // Size ~2.5x2.5.
        const inElevatorZone = (x > -22.5 && x < -19.5 && z > -5.5 && z < -2.5);
        const elevatorStatus = elevatorRef.current.status;

        // Check if player is "Inside" the cabin (and not just walking by)
        // We assume if they are in the zone, they are in.
        // Sync Player Y with Elevator Y if moving or if in zone at height

        let targetY = 0; // Default ground
        // Determine floor support
        // If elevator is at a floor and we are in it, support is Elevator Y.

        // Simple Floor check:
        // Ground Floor always supports (Y=0)
        // Level 2 supports if on balcony/bridge.

        // Level 2 Zones:
        // Left Balcony: X [-32, -20], Z [-80, 40]
        // Right Balcony: X [20, 32], Z [-80, 40]
        // Bridge: Z [-60, -50]
        const inLevel2Zone = ((x < -20 || x > 20) || (z < -50 && z > -60));

        // If inside elevator, we override standard gravity/support
        if (inElevatorZone) {
            elevatorRef.current.playerInside = true;

            if (elevatorStatus === 'moving') {
                // Lock player to elevator movement
                // We set camera Y directly
                camera.position.y = elevatorRef.current.y + PLAYER_HEIGHT;
                velocity.current.set(0, 0, 0); // Disable movement while moving
                return; // Skip rest of physics
            } else {
                // Determine targetY based on elevator Y (it might be at any floor)
                targetY = elevatorRef.current.y;
            }
        } else {
            elevatorRef.current.playerInside = false;
            // Normal floor logic
            const currentY = camera.position.y - PLAYER_HEIGHT;
            if (currentY > 4) {
                // We are high up
                if (inLevel2Zone) {
                    targetY = 7.5; // FLOOR_2_Y
                } else {
                    targetY = 0; // Fall
                }
            } else {
                targetY = 0;
            }
        }


        // --- Movement & Velocity ---
        velocity.current.multiplyScalar(Math.exp(-DAMPING * dt));
        const currentSpeed = keys.current.run ? RUN_SPEED : WALK_SPEED;

        // Use temp vectors to avoid allocation
        const forward = _vecForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0;
        forward.normalize();

        const right = _vecRight.crossVectors(forward, _vecUp).normalize();

        if (keys.current.forward) velocity.current.addScaledVector(forward, currentSpeed * dt * DAMPING);
        if (keys.current.backward) velocity.current.addScaledVector(forward, -currentSpeed * dt * DAMPING);
        if (keys.current.left) velocity.current.addScaledVector(right, -currentSpeed * dt * DAMPING);
        if (keys.current.right) velocity.current.addScaledVector(right, currentSpeed * dt * DAMPING);

        // Calculate Next Position
        const nextX = camera.position.x + velocity.current.x * dt;
        const nextZ = camera.position.z + velocity.current.z * dt;

        // Collision Check
        let canMoveX = true;
        const hallLimitX = 31.5;
        if (nextX < -hallLimitX || nextX > hallLimitX) canMoveX = false;
        if (canMoveX && isColliding(nextX, camera.position.z)) canMoveX = false;

        if (canMoveX) camera.position.x = nextX;

        let canMoveZ = true;
        const hallLimitZMin = -74;
        const hallLimitZMax = 21;
        if (nextZ < hallLimitZMin || nextZ > hallLimitZMax) canMoveZ = false;
        if (canMoveZ && isColliding(camera.position.x, nextZ)) canMoveZ = false;

        if (canMoveZ) camera.position.z = nextZ;

        // Smooth Y Interpolation (Gravity/Steps)
        const nextY = THREE.MathUtils.lerp(camera.position.y, targetY + PLAYER_HEIGHT, 0.2);
        camera.position.y = nextY;

        // --- Head Bob / Tilt ---
        // Simple tilt effect based on velocity
        // We can't easily rotate camera X without fighting controls, 
        // but we can apply a subtle roll or just rely on movement. 
        // For "Game Like" feel, dampening (already done via inertia) is key.
        // We are skipping explicit tilt to avoid PointerLock conflict.

    });

    return (
        <PointerLockControls ref={controlsRef} pointerSpeed={0.8} />
    );
}
