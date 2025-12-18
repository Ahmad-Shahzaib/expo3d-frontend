import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "@react-three/drei";

// Define booth bounding boxes for collision
// Global X axis aligns with booth depth (approx 4m)
// Global Z axis aligns with booth width (approx 6m)
// Booths are rotated, so we approximate the exclusion zones (slightly padded)
const OBSTACLES = [
    // Left Side Booths (Centered at X = -12)
    // Occupy roughly X: [-14, -10], Z: [center-3, center+3]
    { xMin: -14.5, xMax: -9.5, zMin: -8.5, zMax: -1.5 },   // Booth 1 (Z: -5)
    { xMin: -14.5, xMax: -9.5, zMin: -28.5, zMax: -21.5 }, // Booth 2 (Z: -25)
    { xMin: -14.5, xMax: -9.5, zMin: -48.5, zMax: -41.5 }, // Booth 3 (Z: -45)

    // Right Side Booths (Centered at X = 12)
    // Occupy roughly X: [10, 14]
    { xMin: 9.5, xMax: 14.5, zMin: -8.5, zMax: -1.5 },     // Booth 4
    { xMin: 9.5, xMax: 14.5, zMin: -28.5, zMax: -21.5 },   // Booth 5
    { xMin: 9.5, xMax: 14.5, zMin: -48.5, zMax: -41.5 },   // Booth 6

    // Central Bench (Decorations)
    // Centered at X=0, Z=-15. Size approx 4x1.5
    { xMin: -2.5, xMax: 2.5, zMin: -16.5, zMax: -13.5 },
];

function isColliding(x: number, z: number) {
    for (const obs of OBSTACLES) {
        if (x >= obs.xMin && x <= obs.xMax && z >= obs.zMin && z <= obs.zMax) {
            return true;
        }
    }
    return false;
}

export default function PlayerControls() {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        run: false
    });

    const velocity = useRef(new THREE.Vector3());

    // Adjusted physics parameters for slower, tighter movement
    const WALK_SPEED = 5;
    const RUN_SPEED = 10;
    const DAMPING = 15; // Higher damping reduces drift

    useEffect(() => {
        // Attempt to lock immediately if mounting after a user interaction
        if (controlsRef.current) {
            controlsRef.current.lock();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling for movement keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

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
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) resetKeys();
        });

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', resetKeys);
        };
    }, []);

    useFrame((_, delta) => {
        // Prevent movement if not locked
        if (!controlsRef.current?.isLocked) {
            velocity.current.set(0, 0, 0);
            return;
        }

        // Cap delta to prevent physics explosions on lag spikes
        const dt = Math.min(delta, 0.1);

        // Apply Damping
        velocity.current.multiplyScalar(Math.exp(-DAMPING * dt));

        // Determine speed
        const currentSpeed = keys.current.run ? RUN_SPEED : WALK_SPEED;

        // Calculate Movement Direction relative to Camera
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        forward.y = 0; // Keep movement on the floor
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        // Accumulate Velocity
        if (keys.current.forward) velocity.current.addScaledVector(forward, currentSpeed * dt * DAMPING);
        if (keys.current.backward) velocity.current.addScaledVector(forward, -currentSpeed * dt * DAMPING);
        if (keys.current.left) velocity.current.addScaledVector(right, -currentSpeed * dt * DAMPING);
        if (keys.current.right) velocity.current.addScaledVector(right, currentSpeed * dt * DAMPING);

        // --- Collision Detection & Position Update ---
        const nextX = camera.position.x + velocity.current.x;
        const currentZ = camera.position.z;

        // Check Hall Boundaries X
        const hallLimitX = 21.5; // Wall at 22 - 0.5 padding
        let canMoveX = true;
        if (nextX < -hallLimitX || nextX > hallLimitX) canMoveX = false;
        if (canMoveX && isColliding(nextX, currentZ)) canMoveX = false;

        if (canMoveX) {
            camera.position.x = nextX;
        } else {
            velocity.current.x = 0;
        }

        const nextZ = camera.position.z + velocity.current.z;
        const currentX = camera.position.x; // Use updated X

        // Check Hall Boundaries Z
        const hallLimitZMin = -64; // Far Wall at -65
        const hallLimitZMax = 14;  // Entrance Wall at 15
        let canMoveZ = true;
        if (nextZ < hallLimitZMin || nextZ > hallLimitZMax) canMoveZ = false;
        if (canMoveZ && isColliding(currentX, nextZ)) canMoveZ = false;

        if (canMoveZ) {
            camera.position.z = nextZ;
        } else {
            velocity.current.z = 0;
        }

        // Lock Height
        camera.position.y = 1.7;
    });

    return (
        <PointerLockControls
            ref={controlsRef}
            pointerSpeed={0.8} // Adjust sensitivity
        />
    );
}
