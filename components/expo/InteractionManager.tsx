import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface InteractionManagerProps {
    onSelect: (booth: any) => void;
    booths: any[];
}

export default function InteractionManager({ onSelect, booths }: InteractionManagerProps) {
    const { camera, scene } = useThree();
    const [hoveredBooth, setHoveredBooth] = useState<any>(null);
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);

    useFrame(() => {
        raycaster.setFromCamera(center, camera);

        // Find all intersections with booth meshes
        // We need to traverse or check specific objects. 
        // For simplicity, we can rely on the scene graph if we named our booths or put them in a group.
        // But here, let's just check if we hit anything that has userData.boothId

        const intersects = raycaster.intersectObjects(scene.children, true);

        let foundBooth = null;
        for (let i = 0; i < intersects.length; i++) {
            // Check if the object or its parent is a booth
            // We will add userData to the Booth component to make this easier
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
            // Optional: Change cursor or show tooltip
        }
    });

    useEffect(() => {
        const handleClick = () => {
            if (hoveredBooth) {
                onSelect(hoveredBooth);
                // Unlock pointer to allow UI interaction
                // document.exitPointerLock(); // This is handled by the parent state change usually
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [hoveredBooth, onSelect]);

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
