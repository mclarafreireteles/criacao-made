import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform, Image} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameDatabase } from '@/src/database/useGameDatabase';
import { StyledInput } from '@/src/components/StyledInput';
import Colors from '@/constants/Colors';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditCardScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    console.log("Parâmetros de navegação recebidos:", params);

    const cardId = Number(params.card_id);
    const initialText = String(params.card_text || '');
    const initialIsCorrect = params.card_type === '1';

    const { updateCard, deleteCard } = useGameDatabase();
    const initialImage = params.image_uri && params.image_uri !== 'null' ? String(params.image_uri) : null;
    
    const [cardText, setCardText] = useState(initialText);
    const [imageUri, setImageUri] = useState<string | null>(initialImage);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(initialIsCorrect);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], 
                allowsEditing: true,
                aspect: [4, 5],
                quality: 0.5, 
                base64: true, 
            });

            if (!result.canceled) {
                if (Platform.OS === 'web') {
                    const imageBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
                    setImageUri(imageBase64);
                } else {
                    setImageUri(result.assets[0].uri);
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível abrir a galeria.");
        }
    };

    const removeImage = () => {
        setImageUri(null);
    }

    const handleSetCorrect = () => {
        setIsCorrect(true);
    }

    const handleSetIncorrect = () => {
        setIsCorrect(false);
    }

    const handleUpdateCard = async () => {
        if (cardText.trim() === '' && !imageUri) return Alert.alert("Erro", "O texto não pode ser vazio.");
        if (isCorrect === null) return Alert.alert("Atenção", "Por favor, classifique a resposta como correta ou incorreta.");

        if (isNaN(cardId) || cardId < 0){
            console.error("ID de carta inválido:", cardId);
            Alert.alert("Erro", "ID da carta inválido.");
             return;
        }

        setLoading(true);
        try {
            await updateCard(cardId, cardText, isCorrect, imageUri);
            console.log("Carta atualizada com sucesso!");
            router.back(); 
        } catch (error) {
            console.error("Erro ao atualizar carta:", error);
            Alert.alert("Erro", "Falha ao salvar alterações.");
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
        <ScreenContainer>
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

                    <Text style={styles.label}>Imagem da Carta</Text>
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
                            <Text style={styles.imageSelectText}>Adicionar Imagem</Text>
                        </Pressable>
                    )}
                
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
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    containerScreen: {
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
        borderRadius: 20,
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
    imageSelectButton: {
        width: '100%',
        height: 120,
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
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
});