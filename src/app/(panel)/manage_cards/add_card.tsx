import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase } from '@/src/database/useGameDatabase';
import { StyledInput } from '@/src/components/StyledInput';
import Colors from '@/constants/Colors';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/components/ScreenContainer';

export default function AddCardScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { createCard } = useGameDatabase();
    const [cardText, setCardText] = useState('');
    const [isCorrect, setIsCorrect] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], 
                allowsEditing: true,
                aspect: [4, 5],
                // IMPORTANTE: Qualidade 0.5 para não pesar o banco SQLite na Web
                quality: 0.5, 
                // IMPORTANTE: Pedimos para gerar o texto da imagem
                base64: true, 
            });

            if (!result.canceled) {
                if (Platform.OS === 'web') {
                    // --- LÓGICA PARA WEB (SQLite) ---
                    // Pegamos o código base64 e montamos o cabeçalho "data:image..."
                    // Assim, salvamos a FOTO REAL no banco, e não apenas um link.
                    const imageBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
                    setImageUri(imageBase64);
                } else {
                    // --- LÓGICA PARA CELULAR (Android/iOS) ---
                    // No celular, o arquivo é persistente, então salvamos apenas o caminho
                    // para não deixar o banco de dados gigante e lento.
                    setImageUri(result.assets[0].uri);
                }
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível abrir a galeria.");
        }
    };

    const removeImage = () => {
        setImageUri(null);
    }

    const handleSetCorrect = () => {
        setIsCorrect(1);
    }

    const handleSetIncorrect = () => {
        setIsCorrect(0);
    }

    const handleSaveCard = async () => {
        if (cardText.trim() === '' && !imageUri) return Alert.alert("Erro", "O texto da carta não pode ser vazio.");
        if (isCorrect === null) return Alert.alert("Atenção", "Por favor, classifique a resposta como correta ou incorreta.");
        setLoading(true);
        try {
            await createCard({ game_id: gameIdNumber, card_text: cardText, card_type: isCorrect, image_uri: imageUri ?? undefined });
            router.back();
        } catch (error) {
            console.error("Erro ao salvar carta:", error);
            Alert.alert("Erro", "Não foi possível salvar a carta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Adicionar carta" />
            <View style={styles.container}>
                <View>                
                    <StyledInput
                        label="Resposta da Carta"
                        placeholder="Digite o código secreto ou pergunta..."
                        value={cardText}
                        onChangeText={setCardText}
                        multiline={true}
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Imagem da Carta (Opcional)</Text>

                    {/* --- ÁREA DE SELEÇÃO DE IMAGEM --- */}

                    {imageUri ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                            <Pressable style={styles.removeImageButton} onPress={removeImage}>
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable style={styles.imageSelectButton} onPress={pickImage}>
                            <Ionicons name="image-outline" size={32} color={Colors.light.blue} />
                            <Text style={styles.imageSelectText}>Escolher Imagem da Galeria</Text>
                        </Pressable>
                    )}
                </View>

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
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.white,
        paddingHorizontal: 45,
        display: 'flex',
        justifyContent: 'space-around'
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
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
    imagePreviewContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: '#f0f0f0'
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        padding: 8,
        borderRadius: 20,
    },
    imageSelectButton: {
        width: '100%',
        height: 150,
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    imageSelectText: {
        color: Colors.light.blue,
        fontSize: 14,
        fontWeight: '600',
    },
});