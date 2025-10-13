import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, ImageBackground, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { cardBacks } from '@/constants/cardBacks';


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
    const [attempts, setAttempts] = useState(0); // Contador de tentativas
    const [score, setScore] = useState(0); // Pontuação final
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing'); // Estado do jogo

    const selectedCardBack = cardBacks.find(back => back.id === gameDetails?.background_image_url)?.image;

    const handleSelectCard = (selectedCard: CardDatabase) => {
    const isAlreadyGuessed = playerGuess.find(card => card.id === selectedCard.id);
        if (playerGuess.length < (gameDetails?.secret_code_length || 0) && !isAlreadyGuessed) {
            setPlayerGuess([...playerGuess, selectedCard]);
        }
    };

    const handleRemoveFromGuess = (indexToRemove: number) => {
        setPlayerGuess(playerGuess.filter((_, index) => index !== indexToRemove));
    };


    const handleCheckAnswer = () => {
        const codeLength = gameDetails?.secret_code_length || 0;
        if (playerGuess.length !== codeLength) {
            return Alert.alert("Atenção", `Você precisa selecionar ${codeLength} cartas para a sua tentativa.`);
        }

        setAttempts(prev => prev + 1);
        let correctPosition = 0;
        let correctCardWrongPosition = 0;

        const secretCodeCopy = [...secretCode];
        const playerGuessCopy = [...playerGuess];

        // 1ª Passagem: Verifica as cartas na posição CORRETA
        for (let i = 0; i < codeLength; i++) {
            if (playerGuessCopy[i]?.id === secretCodeCopy[i]?.id) {
                correctPosition++;
                // "Anulamos" as cartas encontradas para não contá-las de novo
                playerGuessCopy[i] = null as any; 
                secretCodeCopy[i] = null as any;
            }
        }

        // 2ª Passagem: Verifica as cartas corretas que estão na posição ERRADA
        for (let i = 0; i < codeLength; i++) {
            // Pula a carta que já foi contada na 1ª passagem
            if (playerGuessCopy[i] === null) continue;

            // Procura a carta da tentativa do jogador no que restou do código secreto
            const foundIndex = secretCodeCopy.findIndex(card => card?.id === playerGuessCopy[i]?.id);
            
            if (foundIndex !== -1) {
                correctCardWrongPosition++;
                // "Anulamos" a carta encontrada no código secreto para não contá-la de novo
                secretCodeCopy[foundIndex] = null as any; 
            }
        }

        // Atualiza o estado do feedback para exibir o resultado na tela
        setFeedback({ correctPosition, correctCardWrongPosition });

        // CONDIÇÃO DE VITÓRIA: Se todas as cartas estiverem na posição correta
        if (correctPosition === codeLength) {
            setGameState('won'); // Muda o estado do jogo para "vencido"
            
            // Calcula a pontuação (ex: 1000 pontos menos 100 por tentativa)
            const finalScore = Math.max(1000 - (attempts * 100), 100);
            setScore(finalScore);
        }
    };

    useEffect(() => {
        const setupGame = async () => {
            if (!gameIdNumber) return;
            try {
                setIsLoading(true);
                const [gameData, cardsData] = await Promise.all([
                    getGameById(gameIdNumber),
                    getCardsByGameId(gameIdNumber)
                ]);

                console.log(`--- DADOS BRUTOS DO BANCO ---`);
                console.log(`Encontradas ${cardsData.length} cartas no total para este jogo:`);
                console.log(JSON.stringify(cardsData, null, 2));
                console.log(`------------------------------`);
                
                if (gameData && cardsData.length > 0) {
                    setGameDetails(gameData);
                    const codeLength = gameData.secret_code_length || 4;

                    const correctCards = cardsData.filter(card => card.card_type);
                    const incorrectCards = cardsData.filter(card => !card.card_type);

                    const shuffledCorrectCards = [...correctCards].sort(() => Math.random() - 0.5);
                    const newSecretCode = shuffledCorrectCards.slice(0, codeLength);
                    setSecretCode(newSecretCode);

                    // const distractors = [...incorrectCards].sort(() => Math.random() - 0.5).slice(0, 8);
                    const distractors = [...incorrectCards];
                    const newAnswerPool = [...newSecretCode, ...distractors];

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

    const renderSecretCode = () => {
        return secretCode.map((card, index) => (
            <View key={`secret-${index}`} style={styles.secretCard}>
                {gameState === 'won' ? (
                    <Text style={styles.secretCardText}>{card.card_text}</Text>
                ) : (
                    <ImageBackground source={selectedCardBack} style={styles.cardBackImage} resizeMode="cover" />
                )}
            </View>
        ));
    };


    const renderGuessSlots = () => {
        const slots = [];
        const length = gameDetails?.secret_code_length || 0;
        for (let i = 0; i < length; i++) {
            slots.push(
                <Pressable key={`guess-${i}`} style={styles.guessSlot} onPress={() => handleRemoveFromGuess(i)}>
                    {playerGuess[i] && <Text style={styles.guessSlotText}>{playerGuess[i].card_text}</Text>}
                </Pressable>
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
        <ScreenContainer style={{ backgroundColor: Colors.light.white }}>
            <ScreenHeader 
                title="Testar jogo"
                rightAccessory={
                    <Pressable style={styles.historyButton}>
                        <Text style={styles.historyButtonText}>Histórico</Text>
                    </Pressable>
                }
            />

            <ScrollView style={styles.gameContainer}>
                {gameDetails?.prompt && (
                <Text style={styles.promptText}>{gameDetails.prompt}</Text>
                )}

                {/* --- 1. ÁREA DO CÓDIGO SECRETO (CARTAS VIRADAS) --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Código Secreto</Text>
                    <View style={styles.secretCodeContainer}>
                        {renderSecretCode()}
                    </View>
                </View>

                {/* --- 2. ÁREA DE TENTATIVA (SLOTS) --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sua Tentativa</Text>
                    <View style={styles.guessSlotsContainer}>
                        {renderGuessSlots()}
                    </View>
                </View>
                
                {/* --- 3. ÁREA DE OPÇÕES (BARALHO PARA ESCOLHER) --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Opções</Text>
                    <FlatList
                        data={answerPool}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={4}
                        renderItem={({ item }) => (
                            <Pressable style={styles.answerCard} onPress={() => handleSelectCard(item)}>
                                <Text style={styles.answerCardText}>{item.card_text}</Text>
                            </Pressable>
                        )}
                        style={styles.answerPoolGrid}
                    />
                </View>

                {/* Feedback e Botão Finalizar */}
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
                
            </ScrollView>
            <View style={styles.footer}>
                 <AppButton title="Verificar Tentativa" onPress={handleCheckAnswer} />
            </View>
        </ScreenContainer>
    );
}


const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        paddingHorizontal: 45,
    },
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
        height: 80,
    },
    guessSlot: {
        width: 60,
        height: 80,
        backgroundColor: '#4B5563',
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
        marginTop: 10,
        paddingHorizontal: 20,
    },
    answerCard: {
        flex: 1,
        margin: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 0.8, 
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        maxWidth: 100,
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
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
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
        fontSize: 12,
        color: '#4B5563', // Cinza escuro para legibilidade
        lineHeight: 16,
    },
    footer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        marginHorizontal: 45
    },
    promptText: {
        fontSize: 18,
        color: '#374151', 
        textAlign: 'center',
        marginBottom: 20, 
        lineHeight: 24, 
    },
    secretCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    secretCard: {
        width: 60,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
    },
    cardBackImage: {
        width: '100%',
        height: '100%',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 10,
    },
    secretCardText: { fontSize: 18, fontWeight: 'bold' },

});