import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

interface InteractionManagerProps {
    onSelect: (booth: any) => void;
    booths: any[];
}

export default function InteractionManager({ onSelect, booths }: InteractionManagerProps) {
    const { camera, scene, pointer, gl } = useThree();
    const [hoveredBooth, setHoveredBooth] = useState<any>(null);
    const raycaster = new THREE.Raycaster();
    const isDragging = useRef(false);
    const mouseDownTime = useRef(0);

    useFrame(() => {
        const isLocked = document.pointerLockElement === gl.domElement;

        // Use center of screen for Raycasting if locked, otherwise use mouse pointer
        if (isLocked) {
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        } else {
            raycaster.setFromCamera(pointer, camera);
        }

        const intersects = raycaster.intersectObjects(scene.children, true);

        let foundBooth = null;
        for (let i = 0; i < intersects.length; i++) {
            let obj: any = intersects[i].object;
            while (obj) {
                if (obj.userData && obj.userData.isBooth) {
                    foundBooth = obj.userData.boothData;
                    break;
                }
                obj = obj.parent;
            }
            if (foundBooth) break;
        }

        if (foundBooth !== hoveredBooth) {
            setHoveredBooth(foundBooth);
            // Change cursor style only if not locked
            if (!isLocked) {
                document.body.style.cursor = foundBooth ? 'pointer' : 'auto';
            }
        }
    });

    useEffect(() => {
        const onMouseDown = () => {
            isDragging.current = false;
            mouseDownTime.current = Date.now();
        };

        const onMouseMove = () => {
            isDragging.current = true;
        };

        const onMouseUp = (event: MouseEvent) => {
            const isLocked = document.pointerLockElement === gl.domElement;

            // If locked (FPS mode), we don't care about drag, we just click what's in front
            if (isLocked) {
                if (hoveredBooth) {
                    onSelect(hoveredBooth);
                }
                return;
            }

            // Normal mode checks
            const clickDuration = Date.now() - mouseDownTime.current;
            const isClick = clickDuration < 200 && !isDragging.current;

            // Check if the click target is the canvas
            if (isClick && event.target === gl.domElement && hoveredBooth) {
                onSelect(hoveredBooth);
            }
        };

        // We attach listeners to the canvas element specifically to avoid UI clicks
        const canvas = gl.domElement;
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseup', onMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'auto';
        };
    }, [hoveredBooth, onSelect, gl]);

    return (
        <>
            {hoveredBooth && (
                <Html position={[0, 0, 0]} center>
                    <div className="pointer-events-none fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
                        <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 text-sm font-medium animate-pulse">
                            Click to View {hoveredBooth.name}
                        </div>
                    </div>
                </Html>
            )}
        </>
    );
}
