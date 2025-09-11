import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';


export default function TestGameScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getGameById, getCardsByGameId } = useGameDatabase();
    
    // --- ESTADOS DO JOGO ---
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [secretCode, setSecretCode] = useState<CardDatabase[]>([]);
    const [answerPool, setAnswerPool] = useState<CardDatabase[]>([]);
    const [playerGuess, setPlayerGuess] = useState<CardDatabase[]>([]);
    const [feedback, setFeedback] = useState<{ correctPosition: number, correctCardWrongPosition: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    // Função para renderizar os espaços da tentativa do usuário
    // const renderGuessSlots = () => {
    //     const slots = [];
    //     for (let i = 0; i < secretCodeLength; i++) {
    //         slots.push(
    //             <View key={i} style={styles.guessSlot}>
    //                 {playerGuess[i] && <Text style={styles.guessSlotText}>{playerGuess[i]}</Text>}
    //             </View>
    //         );
    //     }
    //     return slots;
    // };

    useEffect(() => {
        const setupGame = async () => {
            if (!gameIdNumber) return;
            try {
                setIsLoading(true);
                // 1. Busca os dados do jogo e das cartas do banco
                const [gameData, cardsData] = await Promise.all([
                    getGameById(gameIdNumber),
                    getCardsByGameId(gameIdNumber)
                ]);
                
                if (gameData && cardsData.length > 0) {
                    setGameDetails(gameData);
                    const codeLength = gameData.secret_code_length || 4; // Padrão de 4 se não definido

                    // 2. Filtra as cartas corretas e incorretas
                    const correctCards = cardsData.filter(card => card.card_type);
                    const incorrectCards = cardsData.filter(card => !card.card_type);

                    // 3. Embaralha as cartas corretas para sortear o código secreto
                    const shuffledCorrectCards = [...correctCards].sort(() => Math.random() - 0.5);
                    const newSecretCode = shuffledCorrectCards.slice(0, codeLength);
                    setSecretCode(newSecretCode);

                    // 4. Monta o baralho de respostas (o código + distratores)
                    // Ex: Pega 8 cartas incorretas para preencher o baralho
                    const distractors = [...incorrectCards].sort(() => Math.random() - 0.5).slice(0, 8);
                    const newAnswerPool = [...newSecretCode, ...distractors];

                    // 5. Embaralha o baralho final
                    setAnswerPool(newAnswerPool.sort(() => Math.random() - 0.5));
                }
            } catch (err) {
                console.log('Erro ao preparar o jogo', err);
            } finally {
                setIsLoading(false);
            }
        };
        setupGame();
    }, [gameIdNumber]);

    const renderGuessSlots = () => {
        const slots = [];
        const length = gameDetails?.secret_code_length || 0;
        for (let i = 0; i < length; i++) {
            slots.push(
                <View key={i} style={styles.guessSlot}>
                    {playerGuess[i] && <Text style={styles.guessSlotText}>{playerGuess[i].card_text}</Text>}
                </View>
            );
        }
        return slots;
    };
    
    if (isLoading) {
        return (
            <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.light.blue} />
                <Text>Preparando o jogo...</Text>
            </ScreenContainer>
        )
    }

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
                    data={answerPool}
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
                {/* {feedback && (
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
                )} */}
            </View>

            <View style={styles.footer}>
                <AppButton title="Verificar" onPress={() => router.back()} />
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