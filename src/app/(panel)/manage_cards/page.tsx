import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, useWindowDimensions, Alert, Platform, ScrollView, Image, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import Colors from '@/constants/Colors';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { cardFronts } from '@/constants/cardFronts';
import { GLOBAL_FONT } from '@/src/components/Fonts';
import { PlayingCard } from '@/src/components/game/PlayingCard';


const CODE_LENGTH_OPTIONS = [3, 4, 5, 6];
const MAX_CARDS = 12;

export default function ManageCards() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id)

    const { getCardsByGameId, createCard, updateGameLengthSetting, deleteCard, getGameById, updateGameSettings, updateGameCardFront } = useGameDatabase();

    const [cards, setCards] = useState<CardDatabase[]>([]);
    const [codeLength, setCodeLength] = useState<number | null>(null);
    const [selectionMode, setSelectionMode] = useState<'specific' | 'random' | null>(null);
    const [cardFrontUrl, setCardFrontUrl] = useState<string | null>(null);

    const isCardLimitReached = cards.length >= MAX_CARDS;

    const selectedCardFront = cardFronts.find(front => front.id === cardFrontUrl)?.image || cardFronts[0].image;

    const correctCount = cards.filter(card => card.card_type === 1).length;
    const incorrectCount = cards.filter(card => card.card_type === 0).length;

    const MIN_CORRECT = 9;
    const MIN_INCORRECT = 3;

    const hasEnoughCorrect = correctCount >= MIN_CORRECT;
    const hasEnoughIncorrect = incorrectCount >= MIN_INCORRECT;
    const isGameReady = hasEnoughCorrect && hasEnoughIncorrect;

    const fetchCardsAndSettings = useCallback(async () => {
        if (!gameIdNumber) return;
        try {
            // Busca as cartas e as configurações do jogo ao mesmo tempo
            const [cardsResponse, gameResponse] = await Promise.all([
                getCardsByGameId(gameIdNumber),
                getGameById(gameIdNumber)
            ]);

            setCards(cardsResponse);
            if (gameResponse?.secret_code_length) {
                setCodeLength(gameResponse.secret_code_length);
                setSelectionMode('specific');
                setCardFrontUrl(gameResponse.card_front_url);
            }

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }, [gameIdNumber]);

    useFocusEffect(
        useCallback(() => {
            fetchCardsAndSettings();
        }, [fetchCardsAndSettings])
    );

    const handleSetCodeLength = async (length: number) => {
        setCodeLength(length);
        setSelectionMode('specific');
        console.log(length)
        await updateGameLengthSetting(gameIdNumber, length);
    };

    const handleSetRandomCodeLength = async () => {
        const randomIndex = Math.floor(Math.random() * CODE_LENGTH_OPTIONS.length);
        const randomLength = CODE_LENGTH_OPTIONS[randomIndex];

        await updateGameLengthSetting(gameIdNumber, randomLength);

        setCodeLength(randomLength);
        setSelectionMode('random');
    }

    const handleNavigateToAddCard = () => {
        if (cards.length >= MAX_CARDS) {
            if (Platform.OS === 'web') {
                window.alert("Só é possível criar até 12 cartas por jogo.");
            } else {
                Alert.alert("Limite Atingido", "Só é possível criar até 12 cartas por jogo.");
            }
            return;
        }

        console.log("--- DEBUG ---");
        console.log("Botão clicado. Tentando navegar...");
        console.log("Pathname:", '/manage_cards/add_card');
        console.log("game_id:", gameIdNumber);
        console.log("--- FIM DEBUG ---");
        router.push({
            pathname: '/manage_cards/add_card',
            params: { game_id: gameIdNumber }
        })
    }

    const handleNavigateToEditCard = (card: CardDatabase) => {
        const params = {
            card_id: card.id,
            card_text: card.card_text,
            card_type: String(card.card_type),
            image_uri: card.image_uri ?? ''
        }
        console.log("Parâmetros de navegação sendo enviados:", params);
        router.push({ pathname: '/manage_cards/edit_card', params })
    }

    const renderHeader = () => (
        <View style={styles.headerWrapper}>
            <ScreenHeader title="Criar cartas" />
            <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Tamanho do código secreto</Text>
                <View style={styles.optionsContainer}>
                    {CODE_LENGTH_OPTIONS.map(len => (
                        <Pressable
                            key={len}
                            style={[styles.lengthButton, selectionMode == 'specific' && codeLength === len && styles.lengthButtonActive]}
                            onPress={() => handleSetCodeLength(len)}
                        >
                            <Text style={[styles.lengthButtonText, selectionMode === 'specific' && codeLength === len && styles.lengthButtonTextActive]}>{len}</Text>
                        </Pressable>
                    ))}
                    <Pressable
                        style={[
                            styles.lengthButton,
                            selectionMode === 'random' && styles.lengthButtonActive
                        ]}
                        onPress={handleSetRandomCodeLength}
                    >
                        <Ionicons
                            name="dice-outline"
                            size={22}
                            color={selectionMode === 'random' ? Colors.light.white : Colors.light.blue}
                        />
                    </Pressable>
                </View>
            </View>

            <Pressable
                style={[styles.addCardButton, isCardLimitReached && styles.disabledButton]}
                onPress={handleNavigateToAddCard}
            // disabled={isCardLimitReached} // Desabilita o botão
            >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addCardButtonText}>Adicionar carta</Text>
            </Pressable>

            <Pressable
                style={styles.manualCodeButton}
                onPress={() => router.push({
                    pathname: '/manual_setup/page',
                    params: { game_id: gameIdNumber, intent: 'save' }
                })}
            >
                <Ionicons name="construct-outline" size={20} color={Colors.light.blue} />
                <Text style={styles.manualCodeButtonText}>Definir Código Manual</Text>
            </Pressable>
        </View>
    );

    const renderFooter = () => (
        <>
            <Pressable style={styles.infoLink}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.light.blue} />
                <Text style={styles.infoLinkTxt} onPress={() => router.push({ pathname: '/how_to_play/page' })}>Como funciona o jogo?</Text>
            </Pressable>

            <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Moldura da Carta</Text>
                <FlatList
                    data={cardFronts}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageSelectorContent}
                    style={styles.imageSelector}

                    renderItem={({ item: front }) => (
                        <Pressable
                            key={front.id}
                            onPress={() => handleSetCardFront(front.id)}
                            style={[
                                styles.imageOption,
                                cardFrontUrl === front.id && styles.imageSelected
                            ]}
                        >
                            <Image source={front.image} style={styles.cardImage} />
                        </Pressable>
                    )}
                />

            </View>
            <View style={styles.containerBtn}>
                <Pressable
                    style={[styles.testarBtn, !isGameReady && styles.disabledTestButton]}
                    onPress={() => {
                        if (!isGameReady) {
                            const title = "Jogo Incompleto";
                            const message = `Para jogar, é necessário ter no mínimo:\n` +
                                `• ${MIN_CORRECT} cartas corretas (Atual: ${correctCount})\n` +
                                `• ${MIN_INCORRECT} cartas incorretas (Atual: ${incorrectCount})\n\n` +
                                `Por favor, edite o jogo e adicione mais cartas.`;

                            if (Platform.OS === 'web') {
                                setTimeout(() => {
                                    window.alert(message);
                                }, 100);
                            } else {
                                Alert.alert(
                                    title,
                                    message,
                                    [
                                        { text: "Entendi" }
                                    ]
                                );
                            }
                        } else {
                            router.push({
                                pathname: '/(panel)/game_mode/page',
                                params: { game_id: gameIdNumber }
                            })
                        }
                    }}
                >
                    <Text style={[styles.testarBtnTxt, !isGameReady && styles.testarBtnTxtDisabled]}>Testar jogo</Text>
                </Pressable>
            </View>
        </>
    );

    const handleSetCardFront = async (frontUrl: string) => {
        setCardFrontUrl(frontUrl);
        await updateGameCardFront(gameIdNumber, frontUrl);
    }

    const numColumns = 4;
    const screenPadding = 20 * 2;
    const cardMargin = 6 * 2 * numColumns;
    const availableWidth = width - screenPadding - cardMargin;
    const cardWidth = availableWidth / numColumns;


    return (
        <ScrollView
            contentContainerStyle={[styles.scrollContainer, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}
            {renderHeader()}

            <View style={styles.statusContainer}>
                <View style={[styles.statusBox, hasEnoughCorrect ? styles.statusSuccess : styles.statusPending]}>
                    <Text style={styles.statusLabel}>Corretas</Text>
                    <Text style={styles.statusValue}>{correctCount} / {MIN_CORRECT}</Text>
                    <Ionicons
                        name={hasEnoughCorrect ? "checkmark-circle" : "alert-circle"}
                        size={20}
                        color={hasEnoughCorrect ? "#15803d" : "#b91c1c"}
                    />
                </View>

                <View style={[styles.statusBox, hasEnoughIncorrect ? styles.statusSuccess : styles.statusPending]}>
                    <Text style={styles.statusLabel}>Incorretas</Text>
                    <Text style={styles.statusValue}>{incorrectCount} / {MIN_INCORRECT}</Text>
                    <Ionicons
                        name={hasEnoughIncorrect ? "checkmark-circle" : "alert-circle"}
                        size={20}
                        color={hasEnoughIncorrect ? "#15803d" : "#b91c1c"}
                    />
                </View>
            </View>

            {!isGameReady && (
                <Text style={styles.warningText}>
                    Adicione mais cartas para habilitar o teste do jogo.
                </Text>
            )}

            {/* GRID DE CARTAS */}
            <View style={styles.cardsGrid}>
                {cards.length > 0 ? (
                    cards.map((item) => (
                        <View key={item.id} style={styles.cardWrapperRelative}>

                            <PlayingCard
                                variant="front"
                                text={item.card_text}
                                contentImageUri={item.image_uri} 
                                imageSource={selectedCardFront}
                                onPress={() => handleNavigateToEditCard(item)}
                            />

                            {/* Ícone de Edição (Sobreposto) */}
                            <View style={styles.editBadge} pointerEvents="none">
                                <MaterialIcons name="edit" size={14} color={Colors.light.blue} />
                            </View>

                            {/* Ícone de Status (Sobreposto) */}
                            <View style={styles.statusBadge} pointerEvents="none">
                                <Ionicons
                                    name={item.card_type === 1 ? "checkmark-circle" : "close-circle"}
                                    size={20}
                                    color={item.card_type === 1 ? "#10B981" : "#EF4444"}
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyGrid}>
                        <Text style={styles.emptyGridText}>Adicione sua primeira carta</Text>
                    </View>
                )}
            </View>

            {/* FOOTER */}
            {renderFooter()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    settingSection: {
        marginBottom: 24,
        flex: 1
    },
    settingLabel: {
        fontSize: 16,
        color: Colors.light.darkGrey,
        marginBottom: 12,
        fontFamily: GLOBAL_FONT
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    lengthButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#DFE6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lengthButtonActive: {
        backgroundColor: Colors.light.blue,
    },
    lengthButtonText: {
        fontSize: 16,
        color: Colors.light.blue,
        fontFamily: GLOBAL_FONT
    },
    lengthButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    containerBtn: {
        width: '100%',
        gap: 10,
        paddingBottom: 60,
    },
    testarBtn: {
        borderWidth: 1,
        borderColor: Colors.light.blue,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#FFF',
    },
    testarBtnTxt: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: Colors.light.blue,
        fontFamily: GLOBAL_FONT
    },
    testarBtnTxtDisabled: {
        color: Colors.light.darkGrey
    },
    addCardButton: {
        backgroundColor: Colors.light.blue,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 32
    },
    addCardButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: GLOBAL_FONT
    },
    manualCodeButton: {
        borderColor: Colors.light.blue,
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    manualCodeButtonText: {
        color: Colors.light.blue,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: GLOBAL_FONT
    },
    emptyGrid: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyGridText: {
        fontSize: 16,
        color: Colors.light.darkGrey,
    },
    infoLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginVertical: 24,
        marginBottom: 32,
    },
    infoLinkTxt: {
        color: Colors.light.blue,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: GLOBAL_FONT
    },
    headerWrapper: {
        width: '100%',
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
        opacity: 0.7,
    },
    disabledTestButton: {
        borderWidth: 1,
        borderColor: Colors.light.darkGrey,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#FFF',
    },
    imageSelector: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    imageOption: {
        width: 90,
        height: 112,
        // borderRadius: 8,
        borderWidth: 3,
        borderColor: 'transparent',
        overflow: 'hidden',
        marginRight: 15,
        backgroundColor: '#ffffffff',
    },
    imageSelected: {
        borderColor: Colors.light.blue,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    imageSelectorContent: {
        paddingVertical: 10,
    },
    scrollContainer: {
        paddingHorizontal: 45,
        paddingTop: 40,
        paddingBottom: 20, 
        alignItems: 'center',
        backgroundColor: Colors.light.white,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
        width: '100%',
    },
    statusBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusSuccess: {
        backgroundColor: '#DCFCE7', // Verde claro
        borderColor: '#86EFAC',
    },
    statusPending: {
        backgroundColor: '#FEE2E2', // Vermelho claro
        borderColor: '#FCA5A5',
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        fontFamily: GLOBAL_FONT
    },
    statusValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        fontFamily: GLOBAL_FONT
    },
    warningText: {
        fontSize: 12,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '500',
        fontFamily: GLOBAL_FONT
    },
    cardWrapperRelative: {
        position: 'relative', 
        margin: 6,
    },
    editBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    statusBadge: {
        position: 'absolute',
        bottom: -4,
        left: -4,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 1,
        elevation: 4,
    },
})