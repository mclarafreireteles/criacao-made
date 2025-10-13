import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase, GameDatabase } from '@/src/database/useGameDatabase';

import { ScreenContainer } from "@/src/components/ScreenContainer";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from '@/src/components/AppButton';

import Colors from '@/constants/Colors';

const InfoRow = ({ label, value }: { label: string, value: string | null | undefined }) => {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || "Não informado"}</Text>
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

    const getModelLabel = (modelId: string) => {
        if (modelId === 'secret_code') {
            return 'Código Secreto';
        }
        return modelId; 
    };


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
                <ScrollView style={styles.scrollView}>
                    <View style={styles.infoSection}>
                        <InfoRow label="Assunto" value={game.subject} />
                        <InfoRow label="Série/Ano" value={game.grade} />
                        <InfoRow label="Autores" value={game.authors} />
                        <InfoRow label="Modelo do Jogo" value={getModelLabel(game.model)} />
                        <InfoRow label="Objetivo" value={game.goal} />
                        <InfoRow label="Enunciado Principal" value={game.prompt} />
                        <InfoRow label="Regras" value={game.rules} />
                        <InfoRow label="Explicação" value={game.explanation} />
                        <InfoRow label="Conteúdo" value={game.content} />
                    </View>
                </ScrollView>
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
        paddingHorizontal: 45,
        // paddingVertical: 60,
        backgroundColor: Colors.light.white,
    },
    infoSection: {
        gap: 15,
    },
    buttonContainer: {
        gap: 12,
        paddingTop: 20,
    },
    scrollView: {
        flex: 1,
    },
    infoRow: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        color: '#1E293B',
    },
})