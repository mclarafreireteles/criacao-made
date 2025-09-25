import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase, GameDatabase } from '@/src/database/useGameDatabase';

import { ScreenContainer } from "@/src/components/ScreenContainer";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from '@/src/components/AppButton';

import Colors from '@/constants/Colors';

const InfoRow = ({ label, value }: { label: string, value: string | null | undefined }) => {
    return (
        <View>
            <Text>{label}</Text>
            <Text>{value || "Não informado"}</Text>
        </View>
    )
}

export default function gameDashBoardScreen(){
    const router = useRouter();

    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getGameById } = useGameDatabase();
    const [game, setGame] = useState<GameDatabase | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('procurando jogo');
        const loadGame = async () => {
            if (!gameIdNumber) {
                console.log("Nenhum id de jogo identificado");
                setIsLoading(false);
                return;
            }

            try {
                console.log('Tentando encontrar jogo com ID:', gameIdNumber);
                setIsLoading(true);
                const gameData = await getGameById(gameIdNumber);
                setGame(gameData);
            } catch (error) {
                console.error("Erro ao carregar os dados dos jogos:", error)
            } finally {
                setIsLoading(false);
            };
        }
        loadGame();
    }, [gameIdNumber]);

    if (isLoading) {
        return (
            <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.light.blue} />
                <Text style={{ marginTop: 10 }}>Carregando jogo...</Text>
            </ScreenContainer>
        );
    }

    if (!game) {
        return (
            <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ScreenHeader title="Erro" />
                <Text>Jogo não encontrado.</Text>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <ScreenHeader title="Configurações do jogo"/>
            <View style={styles.content}>
                <View style={styles.infoSection}>
                    <InfoRow label="Assunto" value={game.subject} />
                    <InfoRow label="Série/Ano" value={game.grade} />
                    <InfoRow label="Autores" value={game.authors} />
                    <InfoRow label="Objetivo" value={game.goal} />
                </View>
                <View style={styles.buttonContainer}>
                    <AppButton 
                        title="Gerenciar Cartas" 
                        icon="copy-outline"
                        onPress={() => router.push({
                            pathname: '/manage_cards/page',
                            params: { game_id: gameIdNumber }
                        })}
                    />
                    <AppButton 
                        title="Editar Jogo" 
                        icon="pencil"
                        variant="secondary"
                        onPress={() => router.push({
                            pathname: '/edit_game/page',
                            params: { game_id: gameIdNumber }
                        })}
                    />
                     <AppButton 
                        title="Testar Jogo" 
                        icon="play-circle-outline"
                        variant="secondary"
                        onPress={() => router.push({
                            pathname: '/test_game/page',
                            params: { game_id: gameIdNumber }
                        })}
                    />
                </View>
            </View>
        </ScreenContainer>
        
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 60,
        backgroundColor: Colors.light.white,
    },
    infoSection: {
        gap: 15,
    },
    buttonContainer: {
        gap: 12,
        paddingTop: 20,
    },
})