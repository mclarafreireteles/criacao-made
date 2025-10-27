import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, ImageBackground, Alert, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import { GameDatabase, useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { cardFronts } from '@/constants/cardFronts';


export default function ManualSetupScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getGameById, getCardsByGameId } = useGameDatabase();
    
    // --- ESTADOS ---
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [allCorrectCards, setAllCorrectCards] = useState<CardDatabase[]>([]);
    const [secretCodeSequence, setSecretCodeSequence] = useState<(CardDatabase | null)[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardDatabase | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // const selectedCardFront = cardFronts.find(front => front.id === gameDetails?.card_front_url)?.image;
    const selectedCardFront = cardFronts.find(
        front => front.id === String(gameDetails?.card_front_url)
    )?.image;

    // --- CARREGAMENTO E PREPARAÇÃO ---
    useEffect(() => {
        const loadData = async () => {
            if (!gameIdNumber) return;
            try {
                const [gameData, cardsData] = await Promise.all([
                    getGameById(gameIdNumber),
                    getCardsByGameId(gameIdNumber)
                ]);

                console.log("💾 Dados do jogo:", gameData); // <-- log completo do game
                console.log("💾 card_front_url:", gameData?.card_front_url); // <-- log específico do front
                console.log("💾 Cartas retornadas:", cardsData);
                
                if (gameData && cardsData.length > 0) {
                    setGameDetails(gameData);
                    const codeLength = gameData.secret_code_length || 4;
                    const correctCards = cardsData.filter(card => Number(card.card_type) === 1);
                    
                    if (correctCards.length < codeLength) {
                        // Se não houver cartas corretas suficientes, não pode montar manual
                        Alert.alert("Erro", "Não há cartas corretas suficientes para montar o código secreto.");
                        router.back();
                        return;
                    }

                    setAllCorrectCards(correctCards);
                    setSecretCodeSequence(Array(codeLength).fill(null));
                }
            } catch (error) {
                console.error("Erro ao carregar cartas:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [gameIdNumber]);

    // --- LÓGICA DE CLIQUE (A MESMA DO TESTGAME) ---

    const handleSelectCardFromPool = (cardFromPool: CardDatabase) => {
        const isAlreadyInSequence = secretCodeSequence.find(card => card?.id === cardFromPool.id);
        if (isAlreadyInSequence) return;
        setSelectedCard(prev => (prev?.id === cardFromPool.id ? null : cardFromPool));
    };

    const handleSlotPress = (slotIndex: number) => {
        const currentCardInSlot = secretCodeSequence[slotIndex];
        const newSequence = [...secretCodeSequence];

        if (selectedCard) {
            if (currentCardInSlot) return; 
            newSequence[slotIndex] = selectedCard;
            setSecretCodeSequence(newSequence);
            setSelectedCard(null); 
        } else if (currentCardInSlot) {
            newSequence[slotIndex] = null;
            setSecretCodeSequence(newSequence);
        }
    };

    // --- NAVEGAÇÃO FINAL ---
    const handleStartTest = () => {
        if (secretCodeSequence.some(slot => slot === null)) {
            Alert.alert("Atenção", "Você precisa preencher todos os slots do código secreto.");
            return;
        }

        const manualCodeString = secretCodeSequence.map(card => card!.id).join(',');

        router.push({
            pathname: '/test_game/page',
            params: { 
                game_id: gameIdNumber,
                mode: 'manual',
                manual_code: manualCodeString // Passa o código como uma string
            }
        });
    };

    // --- RENDERIZAÇÃO ---

    const usedCardIds = secretCodeSequence.map(card => card?.id);
    const availableCards = allCorrectCards.filter(card => !usedCardIds.includes(card.id));
    const numColumns = Platform.OS === 'web' ? 12 : 3;

    if (isLoading) {
        return <ScreenContainer style={styles.centerContent}><ActivityIndicator size="large" /></ScreenContainer>;
    }

    console.log("selectedCardFront:", selectedCardFront);

    return (
        <>
            
            <ScreenContainer>
                <ScreenHeader title="Montar Código" />
                
                
                    <View style={styles.containerSection}>
                        <Text style={styles.instructions}>
                            Clique em uma carta "Disponível" e depois clique em um "Slot" para montar a sequência.
                        </Text>
                        {/* --- 1. SLOTS DO CÓDIGO SECRETO --- */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Sequência do Código Secreto</Text>
                            <View style={styles.slotsContainer}>
                                {secretCodeSequence.map((cardInSlot, index) => (
                                    <Pressable key={index} style={styles.slotWrapper} onPress={() => handleSlotPress(index)}>
                                        {cardInSlot ? (
                                            <ImageBackground source={selectedCardFront} style={styles.cardFrontImage} resizeMode='cover'>
                                                <Text style={styles.cardText}>{cardInSlot.card_text}</Text>
                                            </ImageBackground>
                                        ) : (
                                            <View style={styles.slotEmpty} />
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                        <View style={styles.sectionCards}>
                            <Text style={styles.sectionTitle}>Cartas Corretas Disponíveis</Text>

                            {selectedCardFront && (
                                <ScrollView
                                    style={styles.answerPoolScroll}
                                    contentContainerStyle={styles.answerPoolContainer}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}
                                >
                                    {availableCards.map((item) => {
                                    const isSelected = selectedCard?.id === item.id;
                                    return (
                                        <Pressable
                                        key={item.id}
                                        style={[styles.cardWrapper, isSelected && styles.cardSelected]}
                                        onPress={() => handleSelectCardFromPool(item)}
                                        >
                                        <ImageBackground
                                            source={selectedCardFront}
                                            style={styles.cardFrontImage}
                                            resizeMode="cover"
                                        >
                                            <Text style={styles.cardText}>{item.card_text}</Text>
                                        </ImageBackground>
                                        </Pressable>
                                    );
                                    })}
                                </ScrollView>
                                )}
                            </View>
                        
                    </View>
                <View style={styles.footer}>
                    <AppButton title="Iniciar Teste com esta Ordem" onPress={handleStartTest} />
                </View>
                
            </ScreenContainer>
        </>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    centerContent: { justifyContent: 'center', alignItems: 'center' },
    containerSection: {
        paddingHorizontal: 45,
        flex: 1,
    },
    instructions: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        padding: 10,
        width: '100%',
        marginBottom: 12
    },
    section: {
        marginBottom: 20,
    },
    sectionCards:{
        // backgroundColor: 'red's
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 10,
    },
    slotsContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24
    },
    slotWrapper: {
        width: 90, // ✅ Definido o tamanho fixo
        height: 160,
        aspectRatio: 0.8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    slotEmpty: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // Adicionado borderRadius
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#9CA3AF',
    },
    cardWrapper: {
        width: 90,
        aspectRatio: 0.8,
        margin: 3,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderWidth: 2, // Adicionada borda padrão
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: Colors.light.blue,
        transform: [{ scale: 1.05 }],
    },
    cardFrontImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
    },
    footer: {
        padding: 20,
    },
    answerPoolContent: {
        alignItems: 'center',
        height: '100%'
    },
    answerPoolGrid: {
        flex: 1,
        marginTop: 10,
        alignSelf: 'center',
        width: '100%',
        // paddingHorizontal: 20,
    },
    answerPoolScroll: {
        // backgroundColor: 'red',
    },

    answerPoolContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingBottom: 20,
    },
});