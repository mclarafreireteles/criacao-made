import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, ImageBackground, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { cardBacks } from '@/constants/cardBacks';
import { cardFronts } from '@/constants/cardFronts';
import { FeedbackHistoryItem, useGameHistory } from '@/src/contexts/GameHistoryContext';


export default function TestGameScreen() {
    const router = useRouter();
    const { game_id, mode, manual_code } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getGameById, getCardsByGameId } = useGameDatabase();
    const { addHistoryItem, clearHistory } = useGameHistory();

    // --- ESTADOS DO JOGO ---
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [secretCode, setSecretCode] = useState<CardDatabase[]>([]);
    const [answerPool, setAnswerPool] = useState<CardDatabase[]>([]);
    const [playerGuess, setPlayerGuess] = useState<(CardDatabase | null)[]>([]);
    const [feedback, setFeedback] = useState<{ correctPosition: number, correctCardWrongPosition: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [attempts, setAttempts] = useState(0); // Contador de tentativas
    const [score, setScore] = useState(0); // Pontuação final
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing'); // Estado do jogo
    const [selectedCard, setSelectedCard] = useState<CardDatabase | null>(null);

    const selectedCardBack = cardBacks.find(back => back.id === gameDetails?.background_image_url)?.image;
    const selectedCardFront = cardFronts.find(front => front.id === gameDetails?.card_front_url)?.image;
    const numColumns = Platform.OS === 'web' ? 12 : 4;

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}\n\n${message}`);
        } else {
            Alert.alert(title, message);
        }
    }

    const handleSelectCardFromPool = (cardFromPool: CardDatabase) => {
        // Verifica se a carta já está em um dos slots de tentativa
        const isAlreadyGuessed = playerGuess.find(card => card?.id === cardFromPool.id);
        if (isAlreadyGuessed) {
            return; // Não faz nada se a carta já foi usada
        }

        // "Segura" a carta no estado. Se o usuário clicar na mesma, ele a "solta".
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
        const currentAttemptNumber = attempts + 1;
        setAttempts(currentAttemptNumber);

        const codeLength = gameDetails?.secret_code_length || 0;

        if (playerGuess.some(slot => slot === null)) {
            return Alert.alert("Atenção", `Você precisa preencher todos os ${codeLength} espaços para a sua tentativa.`);
        }

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

        // --- LÓGICA DO HISTÓRICO (MODIFICADA) ---
        const newFeedback = { correctPosition, correctCardWrongPosition };
        const newHistoryItem: FeedbackHistoryItem = {
            guess: [...playerGuess],
            feedback: newFeedback,
            attemptNumber: currentAttemptNumber
        };

        // Atualiza o feedback imediato
        setFeedback(newFeedback);
        // Adiciona ao CONTEXTO global
        addHistoryItem(newHistoryItem);
        // --- FIM DA LÓGICA DO HISTÓRICO ---

        // Atualiza o estado do feedback para exibir o resultado na tela
        // setFeedback({ correctPosition, correctCardWrongPosition });

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
                // -----------------------------------------

                if (!gameData || cardsData.length === 0) {
                    showAlert("Erro", "Esse jogo não possui cartas suficientes");
                    router.back();
                    return;
                }

                setGameDetails(gameData);

                // --- DEBUG 2: URLs DAS IMAGENS ---
                // Precisamos fazer isso DEPOIS do setGameDetails
                // ou ler direto do gameData.
                console.log(`[DEBUG 2] URLs de imagem do gameData:`);
                console.log(`background_image_url: ${gameData.background_image_url}`);
                console.log(`card_front_url: ${gameData.card_front_url}`);

                // Vamos simular o que o componente faz no topo
                const foundBack = cardBacks.find(back => back.id === gameData?.background_image_url)?.image;
                const foundFront = cardFronts.find(front => front.id === gameData?.card_front_url)?.image;

                console.log(`[DEBUG 2] Imagem de Fundo encontrada: ${foundBack ? 'SIM' : 'NÃO (undefined)'}`);
                console.log(`[DEBUG 2] Imagem de Frente encontrada: ${foundFront ? 'SIM' : 'NÃO (undefined)'}`);
                // ------------------------------------

                const codeLength = gameData.secret_code_length || 4; // Pega o tamanho do código (padrão 4)

                // Filtra as cartas corretas
                const correctCards = cardsData.filter(card => Number(card.card_type) === 1);

                // --- 2. VALIDAÇÃO DE CARTAS SUFICIENTES (A LÓGICA QUE FALTAVA) ---
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

                // const incorrectCards = cardsData.filter(card => Number(card.card_type) !== 1);

                // const shuffledCorrectCards = [...correctCards].sort(() => Math.random() - 0.5);
                // const newSecretCode = shuffledCorrectCards.slice(0, codeLength);
                // setSecretCode(newSecretCode);

                // const newAnswerPool = [...correctCards, ...incorrectCards].sort(() => Math.random() - 0.5);
                // setAnswerPool(newAnswerPool);

                // console.log("--- DEBUG: RESPOSTA CORRETA ---");
                // console.log(newSecretCode.map(card => card.card_text)); 
                // console.log("---------------------------------");

                // console.log("✅ CORRETAS:", correctCards.length);
                // console.log("❌ INCORRETAS:", incorrectCards.length);
                const incorrectCards = cardsData.filter(card => Number(card.card_type) !== 1);

                // --- LÓGICA DE MODO MANUAL vs ALEATÓRIO ---
                if (mode === 'manual' && typeof manual_code === 'string') {
                    console.log("[DEBUG] Modo MANUAL Ativado. Código recebido:", manual_code);

                    const manualCodeIds = manual_code.split(',').map(Number);
                    const newSecretCode = manualCodeIds.map(id => {
                        return cardsData.find(card => card.id === id);
                    }).filter((card): card is CardDatabase => !!card);

                    setSecretCode(newSecretCode);
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
        };
        setupGame();
    }, [gameIdNumber, mode, manual_code]);

    const renderSecretCode = () => {
        return secretCode.map((card, index) => (
            <View key={`secret-${index}`} style={styles.secretCard}>
                {gameState === 'won' ? (
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
        const length = gameDetails?.secret_code_length || 0;
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
            <ScreenHeader
                title="Testar jogo"
                rightAccessory={
                    <Pressable
                        style={styles.historyButton}
                        onPress={() => router.push({
                            pathname: '/test_game/history',
                            params: {
                                card_front_url_id: gameDetails?.card_front_url
                            }
                        })}
                    >
                        <Text style={styles.historyButtonText}>Histórico</Text>
                    </Pressable>
                }
            />

            <ScrollView
                style={styles.gameContainer}
                contentContainerStyle={styles.scrollContentContainer}
            >
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
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Opções</Text>
                    <FlatList
                        data={answerPool}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={numColumns}
                        key={numColumns}
                        renderItem={({ item }) => {
                            const isUsed = playerGuess.some(card => card?.id === item.id);
                            const isSelected = selectedCard?.id === item.id;

                            return (
                                <Pressable
                                    style={[
                                        styles.answerCardWrapper,
                                        isUsed && styles.answerCardUsed,
                                        isSelected && styles.answerCardSelected
                                    ]}
                                    onPress={() => handleSelectCardFromPool(item)}
                                    disabled={isUsed}
                                >
                                    <ImageBackground source={selectedCardFront} style={styles.cardFrontImage}>
                                        <Text style={styles.answerCardText}>{item.card_text}</Text>
                                    </ImageBackground>
                                </Pressable>
                            )
                        }}
                        style={styles.answerPoolGrid}
                        contentContainerStyle={styles.answerPoolContent}
                    />
                </View> */}
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

                {/* Feedback e Botão Finalizar */}
                {feedback && (
                    <View style={styles.feedbackContainer}>
                        <View style={[styles.feedbackBox, styles.feedbackIncorrect]}>
                            <Text style={styles.feedbackNumber}>{feedback.correctCardWrongPosition}</Text>
                            <Text style={styles.feedbackText}>escolhida correta(s) em {'\n'}posição errada(s)</Text>
                        </View>
                        <View style={[styles.feedbackBox, styles.feedbackCorrect]}>
                            <Text style={styles.feedbackNumber}>{feedback.correctPosition}</Text>
                            <Text style={styles.feedbackText}>escolhidas correta(s) em {'\n'}posição correta(s)</Text>
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
        fontSize: Platform.OS === 'web' ? 28 : 24,
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

});