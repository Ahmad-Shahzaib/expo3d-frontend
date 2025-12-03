import { PointerLockControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PlayerControls() {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward.current = true;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft.current = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward.current = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight.current = true;
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward.current = false;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft.current = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward.current = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight.current = false;
                    break;
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (controlsRef.current?.isLocked) {
            velocity.current.x -= velocity.current.x * 10.0 * delta;
            velocity.current.z -= velocity.current.z * 10.0 * delta;

            direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
            direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
            direction.current.normalize();

            if (moveForward.current || moveBackward.current)
                velocity.current.z -= direction.current.z * 100.0 * delta; // Speed
            if (moveLeft.current || moveRight.current)
                velocity.current.x -= direction.current.x * 100.0 * delta;

            controlsRef.current.moveRight(-velocity.current.x * delta);
            controlsRef.current.moveForward(-velocity.current.z * delta);

            // Clamp Y to simulate walking on floor
            state.camera.position.y = 1.7; // Average eye height
        }
    });

    return (
        <PointerLockControls
            ref={controlsRef}
            selector="#canvas-container" // Optional: if we want to click specific element to lock
        />
    );
}
