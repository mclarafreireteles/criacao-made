import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Modal, SafeAreaView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGameDatabase, CardDatabase } from '@/src/database/useGameDatabase';
import { StyledInput } from '@/src/components/StyledInput';
import Colors from '@/constants/Colors';


const CODE_LENGTH_OPTIONS = [3, 4, 5, 6];

export default function ManageCards (){
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id)

    const { getCardsByGameId, createCard, updateGameSetting } = useGameDatabase();

    const [cards, setCards] = useState<CardDatabase[]>([]);
    const [codeLength, setCodeLength] = useState<number | null>(null);

    const fetchCards = useCallback(async () => {
        if (!gameIdNumber) return;
        try {
            const response = await getCardsByGameId(gameIdNumber);
            setCards(response);
        } catch (error) {
            console.error("Erro ao buscar cartas:", error);
        }
    }, [gameIdNumber]);

    useFocusEffect(
        useCallback(() => {
            fetchCards();
        }, [fetchCards])
    );

    const handleSetCodeLength = async (length: number) => {
        setCodeLength(length);
        console.log(length)
        await updateGameSetting(gameIdNumber, length);
    };

    const handleNavigateToAddCard = () => {
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

    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>Criar cartas</Text>
                {/* <Image source={require('../../../assets/images/logo-made.png')} style={styles.logo} /> */}
            </View>

            <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Tamanho do código secreto</Text>
                <View style={styles.optionsContainer}>
                    {CODE_LENGTH_OPTIONS.map(len => (
                        <Pressable
                            key={len}
                            style={[styles.lengthButton, codeLength === len && styles.lengthButtonActive]}
                            onPress={() => handleSetCodeLength(len)}
                        >
                            <Text style={[styles.lengthButtonText, codeLength === len && styles.lengthButtonTextActive]}>{len}</Text>
                        </Pressable>
                    ))}
                    <Pressable style={styles.lengthButton}>
                        <Ionicons name="dice-outline" size={24} color={Colors.light.blue} />
                    </Pressable>
                </View>
            </View>

            <Pressable style={styles.addCardButton} onPress={handleNavigateToAddCard}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addCardButtonText}>Adicionar carta</Text>
            </Pressable>
        </>
    );

    const renderFooter = () => (
        <>
            <Pressable style={styles.infoLink}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.light.blue} />
                <Text style={styles.infoLinkTxt}>Como funcionam os níveis?</Text>
            </Pressable>

            <View style={styles.containerBtn}>
                <Pressable style={styles.finalizarBtn} onPress={() => router.replace('/(panel)/home/page')}>
                    <Text style={styles.finalizarBtnTxt}>Finalizar</Text>
                </Pressable>
                <Pressable style={styles.testarBtn}>
                    <Text style={styles.testarBtnTxt}>Testar jogo</Text>
                </Pressable>
            </View>
        </>
    );


    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={cards}
                keyExtractor={item => item.game_id.toString()}
                numColumns={3}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{item.card_text}</Text>
                    </View>
                )}
                // Usamos as props especiais aqui
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                // Adicionamos o estilo ao container do conteúdo
                contentContainerStyle={styles.container}
                // Estilo para o grid em si
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
        // backgroundColor: Colors.light.white,
        paddingHorizontal: 60, 
        paddingVertical: 60, 
        alignItems: 'center',
        gap: 30,
        justifyContent: 'space-between',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.white,
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
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lengthButtonActive: {

    },
    lengthButtonText: {

    },
    lengthButtonTextActive: {

    },
    containerBtn: {
        width: '100%',
        gap: 10
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
        paddingVertical: 15,
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
    },
    card: {
        flex: 1,
        aspectRatio: 0.80,
        margin: 6,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
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
    }
})