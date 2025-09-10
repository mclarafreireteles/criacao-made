import { useGameDatabase, GameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { useLocalSearchParams } from "expo-router"
import { useState, useEffect } from 'react';


export default function TestGameScreen() {
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);
    const { getGameById, getCardsByGameId } = useGameDatabase();

    // Estados para guardar os dados
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [allCards, setAllCards] = useState<CardDatabase[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGameData = async () => {
            if (!gameIdNumber) return;
            try {
                const [gameData, cardsData] = await Promise.all([
                    getGameById(gameIdNumber),
                    getCardsByGameId(gameIdNumber)
                ]);
                setGameDetails(gameData);
                setAllCards(cardsData);
            } catch (error) {
                console.error("Erro ao carregar dados do jogo:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadGameData();
    }, [gameIdNumber]);
}