import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ImageBackground, ScrollView, Alert, Platform, Modal, ImageSourcePropType, } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { cardBacks } from '@/constants/cardBacks';
import { cardFronts } from '@/constants/cardFronts';
import { FeedbackHistoryItem, useGameHistory } from '@/src/contexts/GameHistoryContext';

import { GLOBAL_FONT } from '@/src/components/Fonts';

// COMPONENTS
import { PlayingCard } from '@/src/components/game/PlayingCard';
import { GameScoreboard } from '@/src/components/game/GameScoreboard';

type GameLevel = 1 | 2 | 3 | 4;

const LEVEL_CONFIG: Record<GameLevel, { maxAttempts: number, swapCount: number }> = {
    1: { maxAttempts: 10, swapCount: 0 },
    2: { maxAttempts: 8, swapCount: 1 },
    3: { maxAttempts: 6, swapCount: 2 },
    4: { maxAttempts: 5, swapCount: 3 },
};

const DEFAULT_LEVEL: GameLevel = 1;

const MIN_CORRECT = 9;
const MIN_INCORRECT = 3;


export default function TestGameScreen() {
    const router = useRouter();
    const { game_id, mode, manual_code, level } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);
    const currentLevel = (Number(level) as GameLevel) || DEFAULT_LEVEL;
    const { maxAttempts, swapCount } = LEVEL_CONFIG[currentLevel];

    const { getGameById, getCardsByGameId } = useGameDatabase();
    const { addHistoryItem, clearHistory } = useGameHistory();

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
            if (currentCardInSlot) return;
            newGuess[slotIndex] = selectedCard;
            setPlayerGuess(newGuess);
            setSelectedCard(null);

        } else if (currentCardInSlot) {
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

        } else if (currentAttemptNumber >= maxAttempts) {
            setGameState('lost');
            setIsGameOverModalVisible(true);
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

        const CurrentSecretIds = secretCode.map(card => card.id);

        setupGame({
            swapCount: swapCount,
            previousCodeIds: CurrentSecretIds
        });
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalVisible(false);

        setPlayerGuess(Array(activeCodeLength).fill(null));
    };

    const setupGame = useCallback(async (swapOptions?: { swapCount: number, previousCodeIds: number[] }) => {
        if (!gameIdNumber) return;

        if (!swapOptions) {
            clearHistory();
        }

        console.log(`[SETUP] Iniciando. Mode: ${mode}, Swap: ${!!swapOptions}`);

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

            setActiveCodeLength(codeLength);

            const correctCards = cardsData.filter(card => Number(card.card_type) === 1);
            const incorrectCards = cardsData.filter(card => Number(card.card_type) !== 1);



            if (correctCards.length < codeLength || correctCards.length < MIN_CORRECT || incorrectCards.length < MIN_INCORRECT) {
                showAlert(
                    "Cartas Insuficientes",
                    `Este jogo está configurado para um código de ${codeLength} cartas, mas você só criou ${correctCards.length} carta(s) correta(s).\n\nAdicione mais cartas corretas para poder testar.`
                );
                router.back();
                return;
            }

            // --- 3. SE PASSOU, PREPARA O JOGO ---
            setPlayerGuess(Array(codeLength).fill(null));

            // --- LÓGICA DE MODO MANUAL vs ALEATÓRIO ---
            const shouldLoadManualCode = mode === 'manual' && !swapOptions;

            if (shouldLoadManualCode) {
                let manualCodeIds: number[] = [];

                if (typeof manual_code === 'string') {
                    manualCodeIds = manual_code.split(',').map(Number);
                    console.log("[DEBUG] Modo MANUAL - Código recebido via params:", manualCodeIds);
                } else if (gameData.manual_code_ids) {
                    manualCodeIds = gameData.manual_code_ids.split(',').map(Number);
                    console.log("[DEBUG] Modo MANUAL - Código carregado do BANCO:", manualCodeIds);
                } else {
                    console.warn("[WARN] Modo MANUAL mas sem código definido. Falhando para aleatório ou erro?");
                    // Se não tiver código, talvez devêssemos alertar. 
                    // Por enquanto, mantenho o comportamento de cair no bloco "else" se manualCodeIds estiver vazio
                }

                if (manualCodeIds.length > 0) {
                    const newSecretCode = manualCodeIds.map(id => {
                        return cardsData.find(card => card.id === id);
                    }).filter((card): card is CardDatabase => !!card);

                    // Validação extra: se algum ID não foi encontrado (carta deletada), isso pode ser um problema.
                    if (newSecretCode.length !== manualCodeIds.length) {
                        showAlert('Aviso', 'Algumas cartas do código manual salvo não foram encontradas (talvez tenham sido excluídas).');
                    }

                    setSecretCode(newSecretCode);
                    setActiveCodeLength(newSecretCode.length);
                    console.log("--- DEBUG: RESPOSTA MANUAL ---");
                    console.log(newSecretCode.map(card => card.card_text));
                    console.log("---------------------------------");

                    // IMPORTANTE: precisamos garantir que não entramos no bloco 'else if (swapOptions)' nem 'else'
                    // O controle de fluxo original era if (...) else if (...) else.
                    // Vou reestruturar levemente para garantir que se entramos aqui, não fazemos o aleatório.
                } else {
                    // Fallback se não achou código manual: aleatório
                    console.log("[DEBUG] Modo MANUAL falhou (sem código). Gerando aleatório.");
                    const shuffledCorrectCards = [...correctCards].sort(() => Math.random() - 0.5);
                    const newSecretCode = shuffledCorrectCards.slice(0, codeLength);
                    setSecretCode(newSecretCode);
                }

            } else if (swapOptions) {
                const { swapCount, previousCodeIds } = swapOptions;
                const previousCards = correctCards.filter(c => previousCodeIds.includes(c.id));
                const availableForSwap = correctCards.filter(c => !previousCodeIds.includes(c.id));

                if (availableForSwap.length >= swapCount) {
                    const cardsToKeepCount = codeLength - swapCount;
                    const shuffledPrevious = [...previousCards].sort(() => Math.random() - 0.5);
                    const keptCards = shuffledPrevious.slice(0, cardsToKeepCount);

                    const shuffledAvailable = [...availableForSwap].sort(() => Math.random() - 0.5);
                    const addedCards = shuffledAvailable.slice(0, swapCount);

                    const newSecretCode = [...keptCards, ...addedCards].sort(() => Math.random() - 0.5);
                    setSecretCode(newSecretCode);

                    console.log(`[SWAP] Mantidas: ${cardsToKeepCount}, Trocadas: ${swapCount}`);

                    console.log("resposta correta:")
                    console.log(newSecretCode.map(card => card.card_text));

                } else {
                    console.log("[SWAP] Cartas insuficientes para troca limpa. Fazendo shuffle total.");
                    const shuffled = [...correctCards].sort(() => Math.random() - 0.5);
                    setSecretCode(shuffled.slice(0, codeLength));
                }
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


    if (isLoading) {
        return (
            <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.light.blue} />
                <Text style={{ fontFamily: GLOBAL_FONT }}>Preparando o jogo...</Text>
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

                    <GameScoreboard
                        attempts={attempts}
                        maxAttempts={maxAttempts}
                        score={score}
                    />

                    {/* --- 1. ÁREA DO CÓDIGO SECRETO (CARTAS VIRADAS) --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Código Secreto</Text>
                        <View style={styles.secretCodeContainer}>
                            {/* {renderSecretCode()} */}
                            {secretCode.map((card, index) => (
                                <PlayingCard
                                    key={`secret-${index}`}
                                    variant={gameState === 'won' || gameState === 'lost' ? 'front' : 'back'}
                                    text={card.card_text}
                                    imageSource={gameState === 'won' || gameState === 'lost' ? selectedCardFront as ImageSourcePropType : selectedCardBack as ImageSourcePropType}
                                />
                            ))}
                        </View>
                    </View>

                    {/* --- 2. ÁREA DE TENTATIVA (SLOTS) --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sua Tentativa</Text>
                        <View style={styles.guessSlotsContainer}>
                            {/* {renderGuessSlots()} */}
                            {playerGuess.map((cardInSlot, index) => (
                                <PlayingCard
                                    key={`guess-${index}`}
                                    variant={cardInSlot ? 'front' : 'empty'}
                                    text={cardInSlot?.card_text}
                                    imageSource={selectedCardFront as ImageSourcePropType}
                                    onPress={() => handleSlotPress(index)}
                                    contentImageUri={cardInSlot?.image_uri}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Opções</Text>
                        <View style={styles.answerPoolContainer}>
                            {answerPool.map((item) => {
                                const isUsed = playerGuess.some(card => card?.id === item.id);
                                const isSelected = selectedCard?.id === item.id;
                                return (
                                    <PlayingCard
                                        key={item.id}
                                        variant="front"
                                        text={item.card_text}
                                        imageSource={selectedCardFront as ImageSourcePropType}
                                        onPress={() => handleSelectCardFromPool(item)}
                                        isUsed={isUsed}
                                        isSelected={isSelected}
                                        disabled={isUsed}
                                        contentImageUri={item?.image_uri}
                                    />
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
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
    },
    feedbackText: {
        textAlign: 'center',
        marginTop: 4,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 16,
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
    },
    secretCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
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
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
    },
    finalScoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.light.blue,
        fontFamily: GLOBAL_FONT
    },
});