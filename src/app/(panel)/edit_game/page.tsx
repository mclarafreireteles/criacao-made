import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameForm } from '@/src/contexts/GameFormContext';
import { useGameDatabase, GameDatabase } from '@/src/database/useGameDatabase';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { disciplines, grade } from '@/constants/formOptions';

export default function EditGameScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getGameById } = useGameDatabase();
    const { updateFormData } = useGameForm();
    
    // 1. ESTADO LOCAL TEMPORÁRIO para guardar os dados do banco
    const [loadedGameData, setLoadedGameData] = useState<GameDatabase | null>(null);

    // EFEITO 1: Apenas busca os dados do banco e salva no estado local
    useEffect(() => {
        const loadGame = async () => {
            if (!gameIdNumber) {
                router.back();
                return;
            }
            const gameData = await getGameById(gameIdNumber);
            if (gameData) {
                setLoadedGameData(gameData);
            } else {
                alert("Jogo não encontrado.");
                router.back();
            }
        };
        loadGame();
    }, [gameIdNumber]);

    // EFEITO 2: SÓ É DISPARADO QUANDO 'loadedGameData' MUDA
    useEffect(() => {
        if (loadedGameData) {
            console.log("Dados carregados, agora pré-preenchendo o formulário...");

            const subjectOption = disciplines.find(d => d.label === loadedGameData.subject);
            const gradeOption = grade.find(g => g.label === loadedGameData.grade);

            const dataForForm = {
                ...loadedGameData,
                subject: subjectOption ? subjectOption.id : '',
                grade: gradeOption ? gradeOption.id : '',
            };
            
            // Atualiza o formulário
            updateFormData(dataForForm);
            
            // Navega para a primeira etapa
            router.replace('/add_game/step1');
        }
    }, [loadedGameData]); // A dependência agora é o estado local

    // A tela de carregamento continua a mesma
    return (
        <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10 }}>Carregando dados para edição...</Text>
        </ScreenContainer>
    );
}