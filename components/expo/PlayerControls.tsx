import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PlayerControls() {
    const { camera, gl } = useThree();

    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false
    });

    const velocity = useRef(new THREE.Vector3());
    const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
    const isDragging = useRef(false);
    const previousMouse = useRef({ x: 0, y: 0 });

    const SPEED = 10;
    const DAMPING = 8;
    const SENSITIVITY = 0.003;

    useEffect(() => {
        euler.current.setFromQuaternion(camera.quaternion);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = true;
            if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = true;
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = true;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = false;
            if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = false;
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = false;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = false;
        };

        const handleBlur = () => {
            keys.current = { forward: false, backward: false, left: false, right: false };
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                isDragging.current = true;
                previousMouse.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - previousMouse.current.x;
            const deltaY = e.clientY - previousMouse.current.y;

            euler.current.y -= deltaX * SENSITIVITY;
            euler.current.x -= deltaY * SENSITIVITY;
            euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));

            camera.quaternion.setFromEuler(euler.current);
            previousMouse.current = { x: e.clientX, y: e.clientY };
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        gl.domElement.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
            gl.domElement.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [camera, gl]);

    useFrame((_, delta) => {
        // Apply damping
        velocity.current.multiplyScalar(1 - DAMPING * delta);

        // Calculate movement direction
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        // Apply movement
        if (keys.current.forward) velocity.current.addScaledVector(forward, SPEED * delta);
        if (keys.current.backward) velocity.current.addScaledVector(forward, -SPEED * delta);
        if (keys.current.left) velocity.current.addScaledVector(right, -SPEED * delta);
        if (keys.current.right) velocity.current.addScaledVector(right, SPEED * delta);

        // Update position
        camera.position.add(velocity.current);

        // Boundaries
        camera.position.x = Math.max(-45, Math.min(45, camera.position.x));
        camera.position.z = Math.max(-85, Math.min(45, camera.position.z));
        camera.position.y = 1.7;
    });

    return null;
}
