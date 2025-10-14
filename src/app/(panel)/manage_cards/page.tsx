import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, SafeAreaView, useWindowDimensions, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import Colors from '@/constants/Colors';
import { ScreenHeader } from '@/src/components/ScreenHeader';
// import { ScreenContainer } from '@/src/components/ScreenContainer';


const CODE_LENGTH_OPTIONS = [3, 4, 5, 6];
const MAX_CARDS = 12;

export default function ManageCards (){
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id)

    const { getCardsByGameId, createCard, updateGameLengthSetting, deleteCard, getGameById } = useGameDatabase();

    const [cards, setCards] = useState<CardDatabase[]>([]);
    const [codeLength, setCodeLength] = useState<number | null>(null);
    const [selectionMode, setSelectionMode] = useState<'specific' | 'random' | null>(null);

    const isCardLimitReached = cards.length >= MAX_CARDS;

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
            pathname:'/manage_cards/add_card',
            params: {game_id: gameIdNumber}
        })
    }

    const handleNavigateToEditCard = (card: CardDatabase) => {
        const params = {
            card_id: card.id,
            card_text: card.card_text,
            card_type: String(card.card_type)
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

            {/* <Pressable style={styles.addCardButton} onPress={handleNavigateToAddCard} >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addCardButtonText}>Adicionar carta</Text>
            </Pressable> */}
            <Pressable
                style={[styles.addCardButton, isCardLimitReached && styles.disabledButton]}
                onPress={handleNavigateToAddCard}
                // disabled={isCardLimitReached} // Desabilita o botão
            >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addCardButtonText}>Adicionar carta</Text>
            </Pressable>
        </View>
    );

    const renderFooter = () => (
        <>
            <Pressable style={styles.infoLink}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.light.blue} />
                <Text style={styles.infoLinkTxt} onPress={() => router.push({ pathname: '/how_to_play/page'})}>Como funciona o jogo?</Text>
            </Pressable>

            <View style={styles.containerBtn}>
                <Pressable 
                    style={styles.testarBtn} 
                    onPress={() => router.push({ 
                        pathname: '/(panel)/test_game/page', // A URL não precisa do (panel)
                        params: { game_id: gameIdNumber } 
                    })}
                >
                    <Text style={styles.testarBtnTxt}>Testar jogo</Text>
                </Pressable>
                <Pressable style={styles.finalizarBtn} onPress={() => router.replace('/(panel)/home/page')}>
                    <Text style={styles.finalizarBtnTxt}>Salvar</Text>
                </Pressable>
            </View>
        </>
    );

    const numColumns = 4;
    const screenPadding = 20 * 2;
    const cardMargin = 6 * 2 * numColumns;
    const availableWidth = width - screenPadding - cardMargin;
    const cardWidth = availableWidth / numColumns;

    return (
            <SafeAreaView style={styles.safeArea}>
                <FlatList
                    data={cards}
                    keyExtractor={item => item.id.toString()}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <View style={[styles.card, { width: cardWidth }]}>
                            <Text style={styles.cardText}>{item.card_text}</Text>
                            <Pressable onPress={() => handleNavigateToEditCard(item)} style={styles.editBtn}>
                                <MaterialIcons name="edit" size={18} color={Colors.light.blue} />
                            </Pressable>
                        </View>
                        
                    )}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.container}
                    style={styles.grid}
                    ListEmptyComponent={
                        <View style={styles.emptyGrid}>
                            <Text style={styles.emptyGridText}>Adicione sua primeira carta</Text>
                        </View>
                    }
                />
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // gap: 30,
        // justifyContent: 'space-between',
        // paddingHorizontal: 20,
        width: '100%',
    },
    title: {
        fontSize: 24,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.white,
        width: '100%'
    },
    settingSection: {
        marginBottom: 24,
    },
    settingLabel:{
        fontSize: 16,
        color: Colors.light.darkGrey,
        marginBottom: 12,
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
    },
    lengthButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    containerBtn: {
        width: '100%',
        gap: 10,
        paddingBottom: 60
    },
    finalizarBtn: {
        borderWidth: 1,
        borderColor: Colors.light.blue,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#FFF',
    },
    finalizarBtnTxt: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: Colors.light.blue
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
        color: Colors.light.blue
    },
    addCardButton: {
        backgroundColor: Colors.light.blue,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    addCardButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
    grid: {
        flex: 1,
        paddingTop: 40,
        width: '100%',
        // backgroundColor: 'red'
        // height: 10000,
    },
    card: {
        // flex: 1,
        aspectRatio: 0.80,
        marginTop: 50,
        margin: 6,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        maxWidth: 100,
    },
    cardText: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    infoLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginVertical: 24,
    },
    infoLinkTxt: {
        color: Colors.light.blue,
        fontSize: 16,
        fontWeight: '500',
    },
    editBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 2,
    },
    headerWrapper: {
        width: '100%',
        // marginBottom: 20, // Espaço entre o header e a grade
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
        opacity: 0.7,
    },
})