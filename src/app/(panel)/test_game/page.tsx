import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ImageBackground, ScrollView, Alert, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { cardBacks } from '@/constants/cardBacks';
import { cardFronts } from '@/constants/cardFronts';
import { FeedbackHistoryItem, useGameHistory } from '@/src/contexts/GameHistoryContext';

type GameLevel = 1 | 2 | 3 | 4;

const LEVEL_CONFIG: Record<GameLevel, { maxAttempts: number, extraCards: number }> = {
    1: { maxAttempts: 10, extraCards: 0 },
    2: { maxAttempts: 8, extraCards: 1 },
    3: { maxAttempts: 6, extraCards: 2 },
    4: { maxAttempts: 5, extraCards: 3 },
};

const DEFAULT_LEVEL: GameLevel = 1;


export default function TestGameScreen() {
    const router = useRouter();
    const { game_id, mode, manual_code, level } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);
    const currentLevel = (Number(level) as GameLevel) || DEFAULT_LEVEL;
    const { maxAttempts } = LEVEL_CONFIG[currentLevel];

    const { getGameById, getCardsByGameId } = useGameDatabase();
    const { addHistoryItem, clearHistory } = useGameHistory();

    // --- ESTADOS DO JOGO ---
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [secretCode, setSecretCode] = useState<CardDatabase[]>([]);
    const [answerPool, setAnswerPool] = useState<CardDatabase[]>([]);
    const [playerGuess, setPlayerGuess] = useState<(CardDatabase | null)[]>([]);
    const [feedback, setFeedback] = useState<{ correctPosition: number, correctCardWrongPosition: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [selectedCard, setSelectedCard] = useState<CardDatabase | null>(null);
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);
    const [activeCodeLength, setActiveCodeLength] = useState(0);

    const selectedCardBack = cardBacks.find(back => back.id === gameDetails?.background_image_url)?.image;
    const selectedCardFront = cardFronts.find(front => front.id === gameDetails?.card_front_url)?.image;

    const AppLogo = require('../../../../assets/images/logo-made-simples.png');



    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}\n\n${message}`);
        } else {
            Alert.alert(title, message);
        }
    }

    const handleSelectCardFromPool = (cardFromPool: CardDatabase) => {
        const isAlreadyGuessed = playerGuess.find(card => card?.id === cardFromPool.id);
        if (isAlreadyGuessed) {
            return; 
        }
        setSelectedCard(prev => (prev?.id === cardFromPool.id ? null : cardFromPool));
    };

    const handleSlotPress = (slotIndex: number) => {
        const currentCardInSlot = playerGuess[slotIndex];
        const newGuess = [...playerGuess];

        if (selectedCard) {
            // --- CENÁRIO 1: O jogador está "segurando" uma carta ---

            // Se o slot clicado já tem uma carta, não faz nada
            if (currentCardInSlot) return;

            // Coloca a carta que estava "na mão" no slot vazio
            newGuess[slotIndex] = selectedCard;
            setPlayerGuess(newGuess);
            setSelectedCard(null); // Esvazia a "mão" do jogador

        } else if (currentCardInSlot) {
            // --- CENÁRIO 2: O jogador NÃO está segurando nada e clica em um slot PREENCHIDO ---

            // Remove a carta do slot (define como null)
            newGuess[slotIndex] = null;
            setPlayerGuess(newGuess);
        }
    };


    const handleCheckAnswer = () => {
        const codeLength = activeCodeLength;

        if (playerGuess.some(slot => slot === null)) {
            return Alert.alert("Atenção", `Você precisa preencher todos os ${codeLength} espaços para a sua tentativa.`);
        }

        if (playerGuess.length !== codeLength) {
            return Alert.alert("Atenção", `Você precisa selecionar ${codeLength} cartas para a sua tentativa.`);
        }

        const currentAttemptNumber = attempts + 1;
        setAttempts(currentAttemptNumber);

        let correctPosition = 0;
        let correctCardWrongPosition = 0;

        const secretCodeCopy = [...secretCode];
        const playerGuessCopy = [...playerGuess];

        // 1ª Passagem: Verifica as cartas na posição CORRETA
        for (let i = 0; i < codeLength; i++) {
            if (playerGuessCopy[i]?.id === secretCodeCopy[i]?.id) {
                correctPosition++;
                playerGuessCopy[i] = null as any;
                secretCodeCopy[i] = null as any;
            }
        }

        // 2ª Passagem: Verifica as cartas corretas que estão na posição ERRADA
        for (let i = 0; i < codeLength; i++) {
            if (playerGuessCopy[i] === null) continue;
            const foundIndex = secretCodeCopy.findIndex(card => card?.id === playerGuessCopy[i]?.id);

            if (foundIndex !== -1) {
                correctCardWrongPosition++;
                secretCodeCopy[foundIndex] = null as any;
            }
        }

        // --- LÓGICA DO HISTÓRICO ---
        const newFeedback = { correctPosition, correctCardWrongPosition };
        const newHistoryItem: FeedbackHistoryItem = {
            guess: [...playerGuess],
            feedback: newFeedback,
            attemptNumber: currentAttemptNumber
        };


        setFeedback(newFeedback);
        addHistoryItem(newHistoryItem);

        if (correctPosition === codeLength) {
            setGameState('won');
            const finalScore = 10 - (currentAttemptNumber - 1);
            setScore(finalScore);

            setIsGameOverModalVisible(true);

            // showAlert(
            //     "Parabéns!",
            //     `Você descobriu o código em ${currentAttemptNumber} tentativas! \nPontuação Final: ${finalScore}}`
            // );
        } else if (currentAttemptNumber >= maxAttempts) {
            setGameState('lost');
            setIsGameOverModalVisible(true);
            // showAlert(
            //     "Fim de jogo!",
            //     "Você usou todas as 10 tentativas. O código secreto será revelado."
            // )
        } else {
            setIsFeedbackModalVisible(true);
        }
    };

    const handlePlayAgain = () => {
        setIsGameOverModalVisible(false);
        setGameState('playing');
        setAttempts(0);
        setScore(0);
        setFeedback(null);

        const { extraCards } = LEVEL_CONFIG[currentLevel];
        const nextLength = activeCodeLength + extraCards;

        console.log("Tamanho atual do código secreto:", nextLength);

        setupGame(nextLength);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalVisible(false);

        setPlayerGuess(Array(activeCodeLength).fill(null));
    };

    const setupGame = useCallback(async () => {
        if (!gameIdNumber) return;

        clearHistory();
        try {
            setIsLoading(true);

            const [gameData, cardsData] = await Promise.all([
                getGameById(gameIdNumber),
                getCardsByGameId(gameIdNumber)
            ]);

            // --- DEBUG 1: DADOS BRUTOS DO BANCO ---
            console.log(`[DEBUG 1] Buscando dados para game_id: ${gameIdNumber}`);


            console.log("[DEBUG 1] Dados brutos recebidos:");
            console.log("GameData:", JSON.stringify(gameData, null, 2));
            console.log("CardsData:", JSON.stringify(cardsData, null, 2));

            if (!gameData || cardsData.length === 0) {
                showAlert("Erro", "Esse jogo não possui cartas suficientes");
                router.back();
                return;
            }

            setGameDetails(gameData);



            const foundBack = cardBacks.find(back => back.id === gameData?.background_image_url)?.image;
            const foundFront = cardFronts.find(front => front.id === gameData?.card_front_url)?.image;

            console.log(`[DEBUG 2] Imagem de Fundo encontrada: ${foundBack ? 'SIM' : 'NÃO (undefined)'}`);
            console.log(`[DEBUG 2] Imagem de Frente encontrada: ${foundFront ? 'SIM' : 'NÃO (undefined)'}`);

            const codeLength = gameData.secret_code_length || 4;
            const targetCodeLength = customCodeLength || codeLength;

            setActiveCodeLength(targetCodeLength);

            const correctCards = cardsData.filter(card => Number(card.card_type) === 1);

            if (correctCards.length < codeLength) {
                showAlert(
                    "Cartas Insuficientes",
                    `Este jogo está configurado para um código de ${codeLength} cartas, mas você só criou ${correctCards.length} carta(s) correta(s).\n\nAdicione mais cartas corretas para poder testar.`
                );
                router.back();
                return;
            }

            // --- 3. SE PASSOU, PREPARA O JOGO ---
            setPlayerGuess(Array(codeLength).fill(null));
            const incorrectCards = cardsData.filter(card => Number(card.card_type) !== 1);

            // --- LÓGICA DE MODO MANUAL vs ALEATÓRIO ---
            if (mode === 'manual' && typeof manual_code === 'string') {
                console.log("[DEBUG] Modo MANUAL Ativado. Código recebido:", manual_code);

                const manualCodeIds = manual_code.split(',').map(Number);
                const newSecretCode = manualCodeIds.map(id => {
                    return cardsData.find(card => card.id === id);
                }).filter((card): card is CardDatabase => !!card);

                setSecretCode(newSecretCode);
                setActiveCodeLength(newSecretCode.length);
                console.log("--- DEBUG: RESPOSTA MANUAL ---");
                console.log(newSecretCode.map(card => card.card_text));
                console.log("---------------------------------");

            } else {
                console.log("[DEBUG] Modo ALEATÓRIO Ativado.");
                const shuffledCorrectCards = [...correctCards].sort(() => Math.random() - 0.5);
                const newSecretCode = shuffledCorrectCards.slice(0, codeLength);
                setSecretCode(newSecretCode);

                console.log("--- DEBUG: RESPOSTA CORRETA (ALEATÓRIA) ---");
                console.log(newSecretCode.map(card => card.card_text));
                console.log("---------------------------------");
            }

            const newAnswerPool = [...correctCards, ...incorrectCards].sort(() => Math.random() - 0.5);
            setAnswerPool(newAnswerPool);

            console.log("✅ CORRETAS:", correctCards.length);
            console.log("❌ INCORRETAS:", incorrectCards.length);


        } catch (err) {
            console.log('Erro ao preparar o jogo', err);
        } finally {
            setIsLoading(false);
        }
    }, [gameIdNumber, mode, manual_code, level])

    useEffect(() => {
        setupGame();
    }, [setupGame]);

    const renderSecretCode = () => {
        return secretCode.map((card, index) => (
            <View key={`secret-${index}`} style={styles.secretCard}>
                {gameState === 'won' || gameState === 'lost' ? (
                    <ImageBackground source={selectedCardFront} style={styles.cardFrontImage}>
                        <Text style={styles.answerCardText}>{card.card_text}</Text>
                    </ImageBackground>
                ) : (
                    <ImageBackground source={selectedCardBack} style={styles.cardBackImage} resizeMode="cover" />
                )}
            </View>
        ));
    };


    const renderGuessSlots = () => {
        const slots = [];
        const length = activeCodeLength;
        for (let i = 0; i < length; i++) {

            const cardInSlot = playerGuess[i];

            slots.push(
                <Pressable key={`guess-${i}`} style={styles.guessSlot} onPress={() => handleSlotPress(i)}>
                    {cardInSlot ? (
                        <ImageBackground source={selectedCardFront} style={styles.cardFrontImage}>
                            <Text style={styles.guessSlotText}>{cardInSlot.card_text}</Text>
                        </ImageBackground>
                    ) : (
                        <View style={styles.guessSlotEmpty} />
                    )}
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


            <ScrollView
                style={styles.gameContainer}
                contentContainerStyle={styles.scrollContentContainer}
            >

                <ScreenHeader
                    logoSource={AppLogo}
                    rightAccessory={
                        <Pressable
                            style={styles.historyButton}
                            onPress={() => router.push({
                                pathname: '/test_game/history',
                                params: {
                                    id: game_id
                                }
                            })}
                        >
                            <Text style={styles.historyButtonText}>Histórico</Text>
                        </Pressable>
                    }
                />

                <View style={styles.gameArea}>

                
                {gameDetails?.prompt && (
                    <Text style={styles.promptText}>{gameDetails?.prompt}</Text>
                )}

                <View style={styles.gameInfoContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxLabel}>TENTATIVAS</Text>
                        <Text style={styles.infoBoxValue}>{attempts} / {maxAttempts}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxLabel}>PONTUAÇÃO</Text>
                        <Text style={styles.infoBoxValue}>{score}</Text>
                    </View>
                </View>

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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Opções</Text>

                    <View style={styles.answerPoolContainer}>
                        {answerPool.map((item) => {
                            const isUsed = playerGuess.some(card => card?.id === item.id);
                            const isSelected = selectedCard?.id === item.id;

                            return (
                                <Pressable
                                    key={item.id}
                                    style={[
                                        styles.answerCardWrapper,
                                        isUsed && styles.answerCardUsed,
                                        isSelected && styles.answerCardSelected
                                    ]}
                                    onPress={() => handleSelectCardFromPool(item)}
                                    disabled={isUsed}
                                >
                                    <ImageBackground
                                        source={selectedCardFront}
                                        style={styles.cardFrontImage}
                                        resizeMode="cover"
                                    >
                                        <Text style={styles.answerCardText}>{item.card_text}</Text>
                                    </ImageBackground>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                {gameState === 'playing' ? (
                    <AppButton title="Verificar Tentativa" onPress={handleCheckAnswer} />
                ) : (
                    <Text style={styles.gameOverText}>
                        {gameState === 'won'
                            ? `Você Venceu! Pontuação: ${score}`
                            : 'Fim de Jogo! Você usou todas as tentativas.'}
                    </Text>
                )}
            </View>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isFeedbackModalVisible}
                onRequestClose={handleCloseFeedbackModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Resultado da Tentativa</Text>

                        {feedback && (
                            <View style={styles.feedbackContainer}>
                                <View style={[styles.feedbackBox, styles.feedbackIncorrect]}>
                                    <Text style={styles.feedbackNumber}>{feedback.correctCardWrongPosition}</Text>
                                    <Text style={styles.feedbackText}>
                                        {feedback.correctCardWrongPosition === 1 || feedback.correctCardWrongPosition === 0
                                            ? 'Carta correta na posição errada'
                                            : 'Cartas corretas na posição errada'}
                                    </Text>
                                </View>
                                <View style={[styles.feedbackBox, styles.feedbackCorrect]}>
                                    <Text style={styles.feedbackNumber}>{feedback.correctPosition}</Text>
                                    <Text style={styles.feedbackText}>
                                        {feedback.correctPosition === 1 || feedback.correctPosition === 0
                                            ? 'Carta correta na posição correta'
                                            : 'Cartas corretas na posição correta'}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <AppButton title="Ok" onPress={() => setIsFeedbackModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isGameOverModalVisible}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        {gameState === 'won' ? (
                            <>
                                <Text style={[styles.modalTitle, styles.victoryTitle]}>Parabéns!</Text>
                                <Text style={styles.gameOverMessage}>Você descobriu o código secreto!</Text>
                                <View style={styles.finalScoreContainer}>
                                    <Text style={styles.finalScoreLabel}>Sua Pontuação</Text>
                                    <Text style={styles.finalScoreValue}>{score}</Text>
                                </View>
                            </>
                        ) : (

                            <>
                                <Text style={[styles.modalTitle, styles.defeatTitle]}>Fim de Jogo!</Text>
                                <Text style={styles.gameOverMessage}>Você usou todas as suas tentativas.</Text>
                            </>
                        )}

                        <AppButton title="Jogar Novamente" onPress={handlePlayAgain} />
                    </View>
                </View>
            </Modal>
        </ScreenContainer>

    );
}


const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        //paddingHorizontal: 45,
    },
    gameArea: {
        flex: 1,
        paddingHorizontal: 45,
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
        gap: 24,
        marginBottom: 30,
    },
    guessSlot: {
        minWidth: 90,
        aspectRatio: 0.8,
        backgroundColor: Colors.light.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#9CA3AF',
    },
    guessSlotText: {
        color: Colors.light.text,
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'center',
    },
    answerPoolGrid: {
        flex: 1,
        marginTop: 10,
        alignSelf: 'center',
        width: '100%',
        borderColor: 'red',
        borderWidth: 2,
    },
    answerCard: {
        flex: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 0.8,
        elevation: 2,
        width: 120
    },
    answerCardText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
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
        marginHorizontal: 18
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedbackText: {
        textAlign: 'center',
        marginTop: 4,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 16,
    },
    footer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        marginHorizontal: 45
    },
    promptText: {
        lineHeight: Platform.OS === 'web' ? 32 : 28,
        fontSize: Platform.OS === 'web' ? 20 : 16,
        color: '#374151',
        textAlign: 'center',
        marginBottom: 20,
    },
    secretCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    secretCard: {
        margin: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 0.8,
        elevation: 2,
        maxWidth: 110,
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
    secretCardText: {
        fontSize: 14,
        fontWeight: 600
    },
    backgroundImage: {
        flex: 1,
    },
    cardFrontImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guessSlotEmpty: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerCardWrapper: {
        minWidth: 90,
        maxWidth: 110,
        aspectRatio: 0.8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        elevation: 2,
    },
    answerCardUsed: {
        opacity: 0.3,
    },
    answerCardSelected: {
        borderWidth: 2,
        borderColor: Colors.light.blue,
        transform: [{ scale: 1.05 }],
    },
    answerPoolContent: {
        alignItems: 'center',
        height: '100%'
    },
    scrollContentContainer: {
        flexGrow: 1,
    },
    answerPoolContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 30,
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    modalCloseButton: {
        marginTop: 25,
        backgroundColor: Colors.light.blue,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        elevation: 2,
    },
    modalCloseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    gameOverText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.blue,
        textAlign: 'center',
        paddingVertical: 15,
    },
    gameInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 15,
        marginBottom: 20,
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    infoBoxLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    infoBoxValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 4,
    },
    victoryTitle: {
        color: '#16A34A',
    },
    defeatTitle: {
        color: '#DC2626',
    },
    gameOverMessage: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 20,
    },
    finalScoreContainer: {
        alignItems: 'center',
        marginBottom: 25,
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        width: '100%',
    },
    finalScoreLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    finalScoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.light.blue,
    },
});