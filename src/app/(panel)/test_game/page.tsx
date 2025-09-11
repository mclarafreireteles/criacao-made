import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase } from '@/src/database/useGameDatabase';

// Dados de exemplo para montarmos a UI
const MOCK_ANSWER_POOL = [
    { id: 1, card_text: 'resposta' }, { id: 2, card_text: 'B' }, { id: 3, card_text: 'C' }, { id: 4, card_text: 'D' },
    { id: 5, card_text: 'E' }, { id: 6, card_text: 'F' }, { id: 7, card_text: 'G' }, { id: 8, card_text: 'H' },
    { id: 9, card_text: 'I' }, { id: 10, card_text: 'J' }, { id: 11, card_text: 'K' }, { id: 12, card_text: 'L' },
];

export default function TestGameScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getGameById, getCardsByGameId } = useGameDatabase();
    
    // Estados para controlar a UI
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [secretCodeLength, setSecretCodeLength] = useState(4); 
    const [playerGuess, setPlayerGuess] = useState(['A', 'B']); // Exemplo: usuário já escolheu 2
    const [feedback, setFeedback] = useState({ correctPosition: 3, correctCardWrongPosition: 1 });

    // Função para renderizar os espaços da tentativa do usuário
    const renderGuessSlots = () => {
        const slots = [];
        for (let i = 0; i < secretCodeLength; i++) {
            slots.push(
                <View key={i} style={styles.guessSlot}>
                    {playerGuess[i] && <Text style={styles.guessSlotText}>{playerGuess[i]}</Text>}
                </View>
            );
        }
        return slots;
    };

    useEffect(() => {
        const loadGameData = async () => {
            if (!gameIdNumber) return;
            try {
                const [gameData, cardsData] = await Promise.all([
                    getGameById(gameIdNumber), // Esta função busca os detalhes, incluindo o prompt
                    getCardsByGameId(gameIdNumber)
                ]);
                setGameDetails(gameData);
                // ... resto da lógica ...
            } catch(err) {
                console.log('Erro', err);
            }
        };
        loadGameData();
    }, [gameIdNumber]);

    return (
        <ScreenContainer style={{ backgroundColor: '#F3F4F6' }}>
            <ScreenHeader 
                title="Testar jogo"
                rightAccessory={
                    <Pressable style={styles.historyButton}>
                        <Text style={styles.historyButtonText}>Histórico</Text>
                    </Pressable>
                }
            />

        
            <View style={styles.gameArea}>
                {gameDetails?.prompt && (
                    <Text style={styles.promptText}>{gameDetails.prompt}</Text>
                )}
                {/* Espaços para a tentativa do jogador */}
                <View style={styles.guessSlotsContainer}>
                    {renderGuessSlots()}
                </View>

                {/* Baralho de cartas para escolher */}
                <FlatList
                    data={MOCK_ANSWER_POOL}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={4}
                    renderItem={({ item }) => (
                        <Pressable style={styles.answerCard}>
                            <Text style={styles.answerCardText}>{item.card_text}</Text>
                        </Pressable>
                    )}
                    style={styles.answerPoolGrid}
                />

                {/* Área de Feedback */}
                {feedback && (
                    <View style={styles.feedbackContainer}>
                        <View style={[styles.feedbackBox, styles.feedbackIncorrect]}>
                            <Text style={styles.feedbackNumber}>{feedback.correctCardWrongPosition}</Text>
                            <Text style={styles.feedbackText}>escolhida correta em {'\n'}posição errada</Text>
                        </View>
                        <View style={[styles.feedbackBox, styles.feedbackCorrect]}>
                            <Text style={styles.feedbackNumber}>{feedback.correctPosition}</Text>
                            <Text style={styles.feedbackText}>escolhidas corretas em {'\n'}posição correta</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <AppButton title="Testar" onPress={() => router.back()} />
            </View>
        </ScreenContainer>
    );
}


const styles = StyleSheet.create({
    gameArea: {
        flex: 1,
        justifyContent: 'center',
    },
    historyButton: {
        borderWidth: 1,
        borderColor: Colors.light.blue,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    historyButtonText: {
        color: Colors.light.blue,
        fontWeight: '500',
    },
    guessSlotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 30,
        height: 80, // Altura fixa para os slots
    },
    guessSlot: {
        width: 60,
        height: 80,
        backgroundColor: '#4B5563', // Cinza escuro
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guessSlotText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    answerPoolGrid: {
        flex: 1,
    },
    answerCard: {
        flex: 1,
        margin: 5,
        height: 60,
        backgroundColor: '#E5E7EB', // Cinza claro
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerCardText: {
        fontSize: 18,
        fontWeight: '600',
    },
    feedbackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        gap: 10,
    },
    feedbackBox: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    feedbackIncorrect: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
    },
    feedbackCorrect: {
        backgroundColor: '#D1FAE5',
        borderColor: '#6EE7B7',
        borderWidth: 1,
    },
    feedbackNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    feedbackText: {
        textAlign: 'center',
        marginTop: 4,
    },
    footer: {
        paddingTop: 10,
    },
    promptText: {
        fontSize: 18,
        color: '#374151', // Cinza escuro
        textAlign: 'center',
        marginBottom: 20, // Espaço antes dos slots de adivinhação
        lineHeight: 24, // Melhora a legibilidade
    },
});