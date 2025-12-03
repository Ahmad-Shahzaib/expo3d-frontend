"use client";

import dynamic from "next/dynamic";

// Dynamically import the scene to avoid SSR issues with Three.js/Canvas
const ExpoHallScene = dynamic(() => import("@/components/expo/ExpoHallScene"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center bg-black text-white">
            Loading Expo Hall...
        </div>
    ),
});

export default function ExpoHallPage() {
    return (
        <main className="w-full h-screen overflow-hidden bg-black">
            <ExpoHallScene />
        </main>
    );
}
