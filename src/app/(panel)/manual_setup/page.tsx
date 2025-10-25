import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, ImageBackground, Alert, Platform } from 'react-native';
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

    const selectedCardFront = cardFronts.find(front => front.id === gameDetails?.card_front_url)?.image;

    // --- CARREGAMENTO E PREPARAÇÃO ---
    useEffect(() => {
        const loadData = async () => {
            if (!gameIdNumber) return;
            try {
                const [gameData, cardsData] = await Promise.all([
                    getGameById(gameIdNumber),
                    getCardsByGameId(gameIdNumber)
                ]);
                
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
        // Verifica se todos os slots estão preenchidos
        if (secretCodeSequence.some(slot => slot === null)) {
            Alert.alert("Atenção", "Você precisa preencher todos os slots do código secreto.");
            return;
        }

        // Converte o array de cartas em uma string de IDs (ex: "5,2,8,1")
        const manualCodeString = secretCodeSequence.map(card => card!.id).join(',');

        // Navega para a tela de teste com os parâmetros manuais
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

    // Filtra as cartas disponíveis (que não estão nos slots)
    const usedCardIds = secretCodeSequence.map(card => card?.id);
    const availableCards = allCorrectCards.filter(card => !usedCardIds.includes(card.id));

    if (isLoading) {
        return <ScreenContainer style={styles.centerContent}><ActivityIndicator size="large" /></ScreenContainer>;
    }

    return (
        <ScreenContainer>
            <ScreenHeader title="Montar Código Manual" />
            
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
                                <ImageBackground source={selectedCardFront} style={styles.cardFrontImage}>
                                    <Text style={styles.cardText}>{cardInSlot.card_text}</Text>
                                </ImageBackground>
                            ) : (
                                <View style={styles.slotEmpty} />
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* --- 2. CARTAS CORRETAS DISPONÍVEIS --- */}
            <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Cartas Corretas Disponíveis</Text>
                <FlatList
                    data={availableCards}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    renderItem={({ item }) => {
                        const isSelected = selectedCard?.id === item.id;
                        return (
                            <Pressable style={[styles.cardWrapper, isSelected && styles.cardSelected]} onPress={() => handleSelectCardFromPool(item)}>
                                <ImageBackground source={selectedCardFront} style={styles.cardFrontImage}>
                                    <Text style={styles.cardText}>{item.card_text}</Text>
                                </ImageBackground>
                            </Pressable>
                        );
                    }}
                />
            </View>

            <View style={styles.footer}>
                <AppButton title="Iniciar Teste com esta Ordem" onPress={handleStartTest} />
            </View>
        </ScreenContainer>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    centerContent: { justifyContent: 'center', alignItems: 'center' },
    instructions: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        padding: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 10,
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    slotWrapper: {
        width: 80,
        aspectRatio: 0.7,
        borderRadius: 8,
        overflow: 'hidden',
    },
    slotEmpty: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#9CA3AF',
    },
    cardWrapper: {
        flex: 1 / 3,
        aspectRatio: 0.7,
        margin: 5,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
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
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    footer: {
        padding: 20,
    }
});