import { useState } from "react";

interface WelcomeModalProps {
    onEnter: () => void;
}

export default function WelcomeModal({ onEnter }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(true);

    const handleEnter = () => {
        setIsOpen(false);
        onEnter();
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Virtual Expo 2025</h1>
                <p className="text-gray-400 mb-8">Experience the future of exhibitions.</p>

                <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-cyan-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                        </div>
                        <h3 className="text-white font-medium mb-1">Navigate</h3>
                        <p className="text-xs text-gray-500">Use WASD or Arrow keys to walk around the hall.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-purple-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-medium mb-1">Interact</h3>
                        <p className="text-xs text-gray-500">Click on booths to view details and connect.</p>
                    </div>
                </div>

                <button
                    onClick={handleEnter}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-cyan-500/25"
                >
                    Enter Exhibition
                </button>
            </div>
        </div>
    );
}
