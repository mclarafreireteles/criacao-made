import { View, Button, Alert, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import { useAuth } from '@/src/contexts/AuthContext';
import { useGameDatabase } from "@/src/database/useGameDatabase";
import Colors from "@/constants/Colors";
import { StyledInput } from "@/src/components/StyledInput";

export default function Step3() {
    const router = useRouter();
    const { user } = useAuth();
    const gameDatabase = useGameDatabase();
    const { formData, updateFormData, resetForm } = useGameForm();

    async function handleCreateGame() {
        if (!user?.id) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login para continuar.");
            return;
        }

        const requiredFields = {
            title: 'Título do jogo',
            subject: 'Disciplina',
            goal: 'Objetivo',
            prompt: 'Enunciado',
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field as keyof typeof formData]?.trim()) {
                Alert.alert('Campo Obrigatório', `O campo "${label}" não pode estar vazio.`);
                return;
            }
        }

        try {
            const finalData = { ...formData, user_id: user.id };

            await gameDatabase.create(finalData);

            Alert.alert("Sucesso", "Jogo cadastrado!");
            resetForm(); 
            router.replace('/(panel)/add_game/created_game');
        } catch (error) {
            console.error("Erro ao criar jogo:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o jogo.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.createGameTitle}>Criar jogo</Text>
            <View style={styles.containerInput}>
                <StyledInput
                    label="Título do jogo"
                    placeholder=""
                    value={formData.title}
                    onChangeText={(text: string) => updateFormData({ title: text })}
                />
                <Input 
                    placeholder="Enunciado" 
                    onChangeText={(text: string) => updateFormData({ prompt: text })} 
                    value={formData.prompt}
                />
                <Input 
                    placeholder="Explicação" 
                    onChangeText={(text: string) => updateFormData({ explanation: text })} 
                    value={formData.explanation}
                />
            </View>
            <View style={styles.containerBtn}>
                <Pressable style={styles.voltarBtn} onPress={() => router.back()}>
                    <Text style={styles.voltarBtnTxt}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.continuarBtn} onPress={handleCreateGame}>
                    <Text style={styles.continuarBtnTxt}>Criar jogo</Text>
                </Pressable>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        paddingVertical: 60,
        alignItems: 'center',
        backgroundColor: Colors.light.white,
        maxWidth: '100%',
        justifyContent: "space-between",
    },
    createGameTitle: {
        fontSize: 24,
    },
    containerInput: {
        minWidth: '80%',
    },
    continuarBtn: {
        borderWidth: 1,
        borderColor: Colors.light.blue,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: Colors.light.blue,
        width: '80%'
    },
    continuarBtnTxt: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: Colors.light.white
    },
    voltarBtn: {
        borderWidth: 1,
        borderColor: Colors.light.blue,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#FFF',
        width: '80%'
    },
    voltarBtnTxt: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: Colors.light.blue
    },
    containerBtn: {
        width: '100%',
        alignItems: 'center',
        gap: 12
        // backgroundColor: Colors.light.blue
    }
})