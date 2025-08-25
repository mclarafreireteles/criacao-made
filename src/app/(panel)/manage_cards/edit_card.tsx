// app/(panel)/manage_cards/edit_card.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, SafeAreaView, Platform} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase } from '@/src/database/useGameDatabase';
import { StyledInput } from '@/src/components/StyledInput';
import Colors from '@/constants/Colors';
import { ScreenHeader } from '@/src/components/ScreenHeader';

export default function EditCardScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const cardId = Number(params.card_id);
    const initialText = String(params.card_text || '');
    const initialIsCorrect = params.card_type === 'true';

    const { updateCard, deleteCard } = useGameDatabase();
    
    const [cardText, setCardText] = useState(initialText);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(initialIsCorrect);
    const [loading, setLoading] = useState(false);

    const handleSetCorrect = () => {
        setIsCorrect(true);
    }

    const handleSetIncorrect = () => {
        setIsCorrect(false);
    }

    const handleUpdateCard = async () => {
        if (cardText.trim() === '') return Alert.alert("Erro", "O texto não pode ser vazio.");
        if (isCorrect === null) return Alert.alert("Atenção", "Por favor, classifique a resposta como correta ou incorreta.");
        setLoading(true);
        try {
            await updateCard(cardId, cardText, isCorrect);
            router.back(); 
        } catch (error) {
            console.error("Erro ao atualizar carta:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteCard = () => {
        // 2. EXTRAÍMOS A LÓGICA DE EXCLUSÃO PARA UMA FUNÇÃO SEPARADA PARA REUTILIZAR
        const performDelete = async () => {
            try {
                await deleteCard(cardId);
                router.back();
            } catch (error) {
                console.error("Erro ao deletar carta:", error);
                Alert.alert("Erro", "Não foi possível excluir a carta.");
            }
        };

        // 3. VERIFICAMOS A PLATAFORMA
        if (Platform.OS === 'web') {
            // Lógica para a Web: usa o confirm() do navegador
            if (window.confirm("Você tem certeza que deseja excluir esta carta? Esta ação não pode ser desfeita.")) {
                performDelete();
            }
        } else {
            // Lógica para Nativo (iOS/Android): usa o Alert.alert rico
            Alert.alert(
                "Excluir Carta",
                "Você tem certeza que deseja excluir esta carta? Esta ação não pode ser desfeita.",
                [
                    { text: "Cancelar", style: "cancel" },
                    { 
                        text: "Sim, Excluir", 
                        style: "destructive",
                        onPress: performDelete // Chama a função que criamos
                    }
                ]
            );
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.containerScreen}>
                <ScreenHeader title="Editar Carta" />
                <View style={styles.container}>
                    <StyledInput
                        label="Resposta da Carta"
                        value={cardText}
                        onChangeText={setCardText}
                        multiline={true}
                        numberOfLines={4}
                        style={{ minHeight: 120, textAlignVertical: 'top' }}
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
                            style={[styles.classifyButton, isCorrect && styles.correctButtonActive]}
                            onPress={handleSetCorrect}
                        >
                            <Text style={[styles.classifyButtonText, isCorrect && styles.correctTextActive]}>Correta</Text>
                        </Pressable>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.primaryButton} onPress={handleUpdateCard} disabled={loading}>
                            <Text style={styles.primaryButtonText}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Text>
                        </Pressable>
                        <Pressable style={styles.deleteButton} onPress={handleDeleteCard}>
                            <Text style={styles.deleteButtonText}>Excluir Carta</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff',
    },
    containerScreen: {
        marginVertical: 80,
        flex: 1

    },
    container: {
        padding: 20,
    },
    buttonContainer: {
        marginTop: 'auto', 
        paddingTop: 20,
    },
    primaryButton: {
        backgroundColor: Colors.light.blue,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#EF4444', 
        fontSize: 16,
        fontWeight: '500',
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