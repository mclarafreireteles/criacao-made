import { createContext, ReactNode, useContext, useState } from "react";
import { CardDatabase } from "../database/useGameDatabase"

export type FeedbackHistoryItem = {
    guess: (CardDatabase | null)[];
    feedback: { correctPosition: number, correctCardWrongPosition: number };
    attemptNumber: number;
}

type GameHistoryContextType = {
    history: FeedbackHistoryItem[];
    addHistoryItem: (item: FeedbackHistoryItem) => void;
    clearHistory: () => void;
}

const GameHistoryContext = createContext<GameHistoryContextType | undefined>(undefined);

export function GameHistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<FeedbackHistoryItem[]>([]);

    const addHistoryItem = (item: FeedbackHistoryItem) => {
        setHistory(preHistory => [item, ...preHistory]);
    }

    const clearHistory = () => {
        setHistory([]);
    }

    return (
        <GameHistoryContext.Provider value={{ history, addHistoryItem, clearHistory }}>
            {children}
        </GameHistoryContext.Provider>
    )
}

export function useGameHistory() {
    const context = useContext(GameHistoryContext);
    if (!context) {
        throw new Error('useGameHistory deve ser usado dentro de um GameHistoryProvider');
    }
    return context;
}