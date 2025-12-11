import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

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
    const { camera, gl } = useThree();

    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        run: false
    });

    const velocity = useRef(new THREE.Vector3());
    const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
    const isDragging = useRef(false);
    const previousMouse = useRef({ x: 0, y: 0 });

    // Adjusted physics parameters for slower, tighter movement
    const WALK_SPEED = 5;
    const RUN_SPEED = 10;
    const DAMPING = 15; // Higher damping reduces drift
    const SENSITIVITY = 0.003;

    useEffect(() => {
        // Initialize Euler angles from current camera quaternion so we don't snap
        euler.current.setFromQuaternion(camera.quaternion);

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

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) { // Left Click
                isDragging.current = true;
                previousMouse.current = { x: e.clientX, y: e.clientY };
                document.body.style.cursor = 'grabbing';
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = 'auto'; // Or whatever interaction manager sets
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - previousMouse.current.x;
            const deltaY = e.clientY - previousMouse.current.y;

            euler.current.y -= deltaX * SENSITIVITY;
            euler.current.x -= deltaY * SENSITIVITY;
            // Clamp view up/down
            euler.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, euler.current.x));

            camera.quaternion.setFromEuler(euler.current);
            previousMouse.current = { x: e.clientX, y: e.clientY };
        };

        // Zoom Handler
        const handleWheel = (e: WheelEvent) => {
            if (camera instanceof THREE.PerspectiveCamera) {
                const zoomSpeed = 0.05;
                camera.fov += e.deltaY * zoomSpeed;
                // Clamp FOV (30 is zoomed in, 75 is wide)
                camera.fov = Math.max(30, Math.min(75, camera.fov));
                camera.updateProjectionMatrix();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', resetKeys);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) resetKeys();
        });

        gl.domElement.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        // Attach wheel listener to window to ensure we catch it, or gl.domElement usually works if focused. 
        // Window is safer for "scroll anywhere to zoom" feel.
        window.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', resetKeys);
            gl.domElement.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [camera, gl]);

    useFrame((_, delta) => {
        // Cap delta to prevent physics explosions on lag spikes
        const dt = Math.min(delta, 0.1);

        // Apply Damping (Frame-rate independent: v = v * e^(-d*t))
        // This prevents the velocity flipping direction if dt is large
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
        // We add acceleration to velocity. Simple Euler integration for response.
        if (keys.current.forward) velocity.current.addScaledVector(forward, currentSpeed * dt * DAMPING);
        if (keys.current.backward) velocity.current.addScaledVector(forward, -currentSpeed * dt * DAMPING);
        if (keys.current.left) velocity.current.addScaledVector(right, -currentSpeed * dt * DAMPING);
        if (keys.current.right) velocity.current.addScaledVector(right, currentSpeed * dt * DAMPING);

        // Note: multiplying by DAMPING here compensates for the damping decay, 
        // ensuring terminal velocity ~= currentSpeed.

        // --- Collision Detection & Position Update ---

        // Try Moving X
        const nextX = camera.position.x + velocity.current.x;
        const currentZ = camera.position.z;

        // Check Hall Boundaries X
        const hallLimitX = 45;
        let canMoveX = true;
        if (nextX < -hallLimitX || nextX > hallLimitX) canMoveX = false;
        // Check Obstacles X
        if (canMoveX && isColliding(nextX, currentZ)) canMoveX = false;

        if (canMoveX) {
            camera.position.x = nextX;
        } else {
            velocity.current.x = 0; // Stop momentum on wall hit
        }

        // Try Moving Z
        const nextZ = camera.position.z + velocity.current.z;
        const currentX = camera.position.x; // Use updated X

        // Check Hall Boundaries Z
        // Hall structure is long. Let's allow -85 to +45.
        const hallLimitZMin = -85;
        const hallLimitZMax = 45;

        let canMoveZ = true;
        if (nextZ < hallLimitZMin || nextZ > hallLimitZMax) canMoveZ = false;
        // Check Obstacles Z
        if (canMoveZ && isColliding(currentX, nextZ)) canMoveZ = false;

        if (canMoveZ) {
            camera.position.z = nextZ;
        } else {
            velocity.current.z = 0;
        }

        // Lock Height
        camera.position.y = 1.7;
    });

    return null;
}
