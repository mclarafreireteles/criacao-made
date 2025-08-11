import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase } from '@/src/database/useGameDatabase';
import { StyledInput } from '@/src/components/StyledInput';
import Colors from '@/constants/Colors';

export default function AddCardScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { createCard } = useGameDatabase();
    const [cardText, setCardText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSaveCard = async () => {
        if (cardText.trim() === '') {
            return Alert.alert("Erro", "O texto da carta não pode ser vazio.");
        }
        setLoading(true);
        try {
            await createCard({ game_id: gameIdNumber, card_text: cardText });
            router.back();
        } catch (error) {
            console.error("Erro ao salvar carta:", error);
            Alert.alert("Erro", "Não foi possível salvar a carta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Adicionar Nova Carta</Text>
                
                <StyledInput
                    label="Texto da Carta"
                    placeholder="Digite o código secreto ou pergunta..."
                    value={cardText}
                    onChangeText={setCardText}
                    multiline={true}
                    numberOfLines={4}
                />

                <Pressable style={styles.button} onPress={handleSaveCard} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Carta'}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: Colors.light.blue,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});