import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Loader, PointerLockControls } from "@react-three/drei";
import HallStructure from "./HallStructure";
import PlayerControls from "./PlayerControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Booth from "./Booth";
import BoothPopup from "./BoothPopup";
import Decorations from "./Decorations";
import InteractionManager from "./InteractionManager";
import WelcomeModal from "./WelcomeModal";

const BOOTHS_DATA = [
    // Left side
    { id: 1, name: "TechCorp", color: "#00ffff", position: [-8, 0, -5] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { id: 2, name: "InnovateX", color: "#00ffff", position: [-8, 0, -15] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { id: 3, name: "AlphaSystems", color: "#00ffff", position: [-8, 0, -25] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },

    // Right side
    { id: 4, name: "FutureVis", color: "#00ffff", position: [8, 0, -5] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { id: 5, name: "GreenEnergy", color: "#00ffff", position: [8, 0, -15] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { id: 6, name: "BlueSky", color: "#00ffff", position: [8, 0, -25] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
];

export default function ExpoHallScene() {
    const [selectedBooth, setSelectedBooth] = useState<any>(null);
    const [hasEntered, setHasEntered] = useState(false);

    return (
        <div className="w-full h-screen bg-black relative" id="canvas-container">
            <Canvas
                shadows
                camera={{ position: [0, 1.7, 5], fov: 60 }}
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    <HallStructure />
                    <Decorations />

                    <EffectComposer>
                        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
                    </EffectComposer>

                    {BOOTHS_DATA.map((booth) => (
                        <Booth
                            key={booth.id}
                            position={booth.position}
                            rotation={booth.rotation}
                            companyName={booth.name}
                            color={booth.color}
                            onClick={() => setSelectedBooth(booth)}
                            boothData={booth}
                        />
                    ))}

                    <InteractionManager onSelect={setSelectedBooth} booths={BOOTHS_DATA} />

                    {hasEntered && !selectedBooth && <PlayerControls />}
                </Suspense>
            </Canvas>

            <Loader />

            {/* Crosshair for FPS controls */}
            {!selectedBooth && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 bg-white rounded-full opacity-50 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
            )}

            {/* Instructions */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white">
                    <h1 className="text-xl font-bold mb-2">Virtual Expo Hall</h1>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Click to Start / Lock Mouse</li>
                        <li>• WASD / Arrows to Move</li>
                        <li>• Mouse to Look</li>
                        <li>• Click Booth to View Details</li>
                        <li>• ESC to Unlock Cursor</li>
                    </ul>
                </div>
            </div>

            {selectedBooth && (
                <BoothPopup booth={selectedBooth} onClose={() => setSelectedBooth(null)} />
            )}

            <WelcomeModal onEnter={() => {
                setHasEntered(true);
            }} />
        </div>
    );
}
