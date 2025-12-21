import React, { createContext, useContext, useRef, ReactNode } from 'react';

type ElevatorStatus = 'idle' | 'moving' | 'door_action';

export interface ElevatorState {
    y: number;
    status: ElevatorStatus;
    doorOpenness: number; // 0 (closed) to 1 (open)
    currentFloor: number;
    targetFloor: number;
    playerInside: boolean;
}

interface ExpoContextType {
    elevatorRef: React.MutableRefObject<ElevatorState>;
}

const ExpoContext = createContext<ExpoContextType | null>(null);

export const FLOOR_HEIGHTS = [0, 7.5]; // Ground, Level 1

export function ExpoProvider({ children }: { children: ReactNode }) {
    const elevatorRef = useRef<ElevatorState>({
        y: 0,
        status: 'idle',
        doorOpenness: 1, // Start open
        currentFloor: 0,
        targetFloor: 0,
        playerInside: false
    });

    return (
        <ExpoContext.Provider value={{ elevatorRef }}>
            {children}
        </ExpoContext.Provider>
    );
}

export function useExpo() {
    const context = useContext(ExpoContext);
    if (!context) {
        throw new Error("useExpo must be used within ExpoProvider");
    }
    return context;
}
