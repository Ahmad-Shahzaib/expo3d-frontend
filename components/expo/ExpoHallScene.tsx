import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Loader } from "@react-three/drei";
import HallStructure from "./HallStructure";
import PlayerControls from "./PlayerControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Booth from "./Booth";
import BoothPopup from "./BoothPopup";
import Decorations from "./Decorations";
import InteractionManager from "./InteractionManager";
import WelcomeModal from "./WelcomeModal";

const BOOTHS_DATA = [
    // Left side (Increased Spacing for easier navigation)
    { id: 1, name: "TechCorp", color: "#00ffff", position: [-12, 0, -5] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { id: 2, name: "InnovateX", color: "#00ffff", position: [-12, 0, -25] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
    { id: 3, name: "AlphaSystems", color: "#00ffff", position: [-12, 0, -45] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },

    // Right side
    { id: 4, name: "FutureVis", color: "#00ffff", position: [12, 0, -5] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { id: 5, name: "GreenEnergy", color: "#00ffff", position: [12, 0, -25] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { id: 6, name: "BlueSky", color: "#00ffff", position: [12, 0, -45] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
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

            {/* Instructions */}
            <div className="absolute top-4 left-4 pointer-events-none max-w-md z-10">
                <div className="bg-black/70 backdrop-blur-md p-5 rounded-lg border border-cyan-500/30 text-white shadow-xl">
                    <h1 className="text-xl font-bold mb-3 text-cyan-400">🎯 Controls</h1>
                    <div className="text-sm text-gray-200 space-y-2">
                        <p>• <span className="text-cyan-300 font-semibold">Mouse</span> to look around</p>
                        <p>• <span className="text-cyan-300 font-semibold">Click</span> to capture cursor</p>
                        <p>• <span className="text-cyan-300 font-semibold">W/A/S/D</span> or <span className="text-cyan-300 font-semibold">Arrow Keys</span> to walk</p>
                        <p>• <span className="text-cyan-300 font-semibold">Shift</span> to sprint</p>
                        <p>• <span className="text-cyan-300 font-semibold">ESC</span> to release cursor</p>
                        <p>• <span className="text-cyan-300 font-semibold">Left Click</span> on booths for details</p>
                    </div>
                </div>
            </div>

            {/* Crosshair for FPS Aiming */}
            {hasEntered && !selectedBooth && (
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference z-50 shadow-[0_0_2px_rgba(0,0,0,0.5)]"></div>
            )}

            {selectedBooth && (
                <BoothPopup booth={selectedBooth} onClose={() => setSelectedBooth(null)} />
            )}

            <WelcomeModal onEnter={() => {
                setHasEntered(true);
            }} />
        </div>
    );
}
