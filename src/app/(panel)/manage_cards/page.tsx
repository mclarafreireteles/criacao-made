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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCardText, setNewCardText] = useState('');

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


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Criar cartas</Text>

                <View style={styles.settingSection}>
                    <Text>Tamanho do código secreto</Text>
                    <View>
                        {CODE_LENGTH_OPTIONS.map(len => (
                            <Pressable 
                                key={len} 
                                style={[styles.lengthButton, codeLength === len && styles.lengthButtonActive]} 
                                onPress={() => handleSetCodeLength(len)}    
                            >
                                <Text
                                    style={[styles.lengthButtonText, codeLength === len && styles.lengthButtonTextActive]}
                                >
                                    {len}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable>
                            <Ionicons name='dice-outline' size={24}/>
                        </Pressable>
                    </View>
                </View>

                <View>
                    <Pressable onPress={handleNavigateToAddCard}>
                        <Text>+ Adicionar carta</Text>
                    </Pressable>

                    <FlatList
                        data={cards}
                        keyExtractor={item => item.game_id.toString()}
                        numColumns={4}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.card_text}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View>
                                <Text>Adicione a sua primeira carta</Text>
                            </View>
                        }
                    />

                    <Pressable>
                        <Text>Como funcionam os níveis?</Text>
                    </Pressable>
                </View>

                <View>
                    <Pressable><Text>Finalizar</Text></Pressable>
                    <Pressable><Text>Testar jogo</Text></Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {},
    title: {},
    safeArea: {},
    settingSection:{},
    lengthButton: {},
    lengthButtonActive: {},
    lengthButtonText: {},
    lengthButtonTextActive: {}
})