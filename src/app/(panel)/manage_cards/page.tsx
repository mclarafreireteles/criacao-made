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

    const handleAddCard = async () => {
        if (newCardText.trim() === '') {
            return Alert.alert("Erro", "O texto da carta não pode ser vazio.");
        }
        try {
            await createCard({ game_id: gameIdNumber, card_text: newCardText });
            setNewCardText('');
            fetchCards(); 
        } catch (error) {
            console.error("Erro ao criar carta:", error);
        }
    };


    return (
        <View>
            <Text>Criar cartas</Text>

            <View>
                <Text>Tamanho do código secreto</Text>
                <View>
                    <Pressable>
                        <Text>3</Text>
                    </Pressable>
                    <Pressable>
                        <Text>4</Text>
                    </Pressable>
                    <Pressable>
                        <Text>5</Text>
                    </Pressable>
                    <Pressable>
                        <Text>6</Text>
                    </Pressable>
                    <Pressable>
                        <Text>Aleatório</Text>
                    </Pressable>
                </View>
            </View>

            <View>
                <Pressable>
                    <Text>+ Adicionar carta</Text>
                </Pressable>

                <View>
                    View das cartas
                </View>

                <Pressable>
                    <Text>Como funcionam os níveis?</Text>
                </Pressable>
            </View>

            <View>
                <Pressable><Text>Finalizar</Text></Pressable>
                <Pressable><Text>Testar jogo</Text></Pressable>
            </View>
        </View>
    )
}