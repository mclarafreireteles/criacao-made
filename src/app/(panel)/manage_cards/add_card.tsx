import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase } from '@/src/database/useGameDatabase';
import { StyledInput } from '@/src/components/StyledInput';
import Colors from '@/constants/Colors';
import { ScreenHeader } from '@/src/components/ScreenHeader';

export default function AddCardScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { createCard } = useGameDatabase();
    const [cardText, setCardText] = useState('');
    const [isCorrect, setIsCorrect] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSetCorrect = () => {
        setIsCorrect(1);
    }

    const handleSetIncorrect = () => {
        setIsCorrect(0);
    }

    const handleSaveCard = async () => {
        if (cardText.trim() === '') return Alert.alert("Erro", "O texto da carta não pode ser vazio.");
        if (isCorrect === null) return Alert.alert("Atenção", "Por favor, classifique a resposta como correta ou incorreta.");
        setLoading(true);
        try {
            await createCard({ game_id: gameIdNumber, card_text: cardText, card_type: isCorrect });
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
                <ScreenHeader title="Adicionar carta" />
                
                <StyledInput
                    label="Resposta da Carta"
                    placeholder="Digite o código secreto ou pergunta..."
                    value={cardText}
                    onChangeText={setCardText}
                    multiline={true}
                    numberOfLines={4}
                />

                <Text style={styles.classifyLabel}>Classificar resposta</Text>
                <View style={styles.classifyContainer}>
                    <Pressable
                        style={[styles.classifyButton, !isCorrect && isCorrect !== null && styles.incorrectButtonActive]}
                        onPress={handleSetIncorrect}
                    >
                        <Text style={[styles.classifyButtonText, !isCorrect && isCorrect !== null && styles.incorrectTextActive]}>Incorreta</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.classifyButton, isCorrect == 1 && styles.correctButtonActive]}
                        onPress={handleSetCorrect}
                    >
                        <Text style={[styles.classifyButtonText, isCorrect == 1 && styles.correctTextActive]}>Correta</Text>
                    </Pressable>
                </View>
        

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
        marginVertical: 60
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
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    classifyLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    classifyContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    classifyButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    classifyButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
    },
    incorrectButtonActive: {
        backgroundColor: '#ffe0e0',
        borderColor: '#ff8a80',
    },
    incorrectTextActive: {
        color: '#e53935',
    },
    correctButtonActive: {
        backgroundColor: '#e6ffe9',
        borderColor: '#a5d6a7',
    },
    correctTextActive: {
        color: '#43a047',
    },
});