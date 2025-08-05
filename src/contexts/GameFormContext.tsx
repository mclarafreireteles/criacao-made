import React, { useContext, createContext, useState, ReactNode } from "react";
import { Game } from "../components/Game";

interface GameFormData {
    model: string,
    subject: string,
    subject_other: string,
    content: string,
    grade: string,
    grade_other: string,
    authors: string,
    rules: string,
    goal: string, 
    background_image_url: string,
    title: string,
    prompt: string,
    explanation: string
}

interface GameFormContextType {
    formData: GameFormData;
    updateFormData: (newData: Partial<GameFormData>) => void;
    resetForm: () => void;
}

const GameFormContext = createContext<GameFormContextType | undefined>(undefined);

const initialState: GameFormData = {
    model: '',
    subject: '',
    subject_other: '',
    content: '',
    grade: '',
    grade_other: '',
    authors: '',
    rules: '',
    goal: '',
    background_image_url: '',
    title: '',
    prompt: '',
    explanation: ''
}

export function GameFormProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<GameFormData>(initialState);

    const updateFormData = (newData: Partial<GameFormData>) => {
        setFormData(prevData => ({...prevData, ...newData}));
    }

    const resetForm = () => {
        setFormData(initialState);
    }

    return (
        <GameFormContext.Provider value={{ formData, updateFormData, resetForm }}>
            {children}
        </GameFormContext.Provider>
    )
}

export function useGameForm(): GameFormContextType {
    const context = useContext(GameFormContext);
    if (!context) {
        throw new Error('useGameForm deve ser usado dentro de um GameFormProvider')
    }
    return context
}
