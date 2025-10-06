import { View, Button, Alert, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import { useAuth } from '@/src/contexts/AuthContext';
import { useGameDatabase } from "@/src/database/useGameDatabase";
import Colors from "@/constants/Colors";
import { StyledInput } from "@/src/components/StyledInput";
import { BackButtonIcon } from "@/src/components/icons/BackButtonIcon";
import { disciplines, grade } from "@/constants/formOptions";

export default function Step3() {
    const router = useRouter();
    const { user } = useAuth();
    const gameDatabase = useGameDatabase();
    const { formData, updateFormData, resetForm } = useGameForm();

    async function handleSaveGame() {
        if (!user?.id) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login para continuar.");
            return;
        }

        const requiredFields = {
            title: 'Título do jogo',
            subject: 'Disciplina',
            explanation: 'Explicação',
            goal: 'Objetivo',
            prompt: 'Enunciado',
        };


        for (const field in requiredFields) {
            const key = field as keyof typeof requiredFields;
            const value = formData[key];
            const label = requiredFields[key];
            if (typeof value === 'string') {
                if (value.trim() === '') {
                    Alert.alert('Campo Obrigatório', `O campo "${label}" não pode estar vazio.`);
                    return;
                }
            } 
            else if (value === null || value === undefined) {
                Alert.alert('Campo Obrigatório', `O campo "${label}" precisa ser selecionado.`);
                return;
            }
        }

        try {

            let finalSubject = formData.subject === 'outro'
                ? formData.subject_other
                : disciplines.find(d => d.id === formData.subject)?.label || formData.subject

            let finalGrade = formData.grade === 'outro'
                ? formData.grade_other
                : grade.find(g => g.id === formData.grade)?.label || formData.grade;

            const finalData = { ...formData, user_id: user.id, subject: finalSubject, grade: finalGrade, secret_code_length: null };

            delete (finalData as Partial<typeof finalData>).subject_other;
            delete (finalData as Partial<typeof finalData>).grade_other;

            if (formData.id !== null) {
                await gameDatabase.updateGameSettings(formData.id, finalData);

                Alert.alert("Sucesso", "Jogo atualizado!");
                resetForm();
                router.replace('/(panel)/choose_game/page')
            } else {
                 const { insertedRowId } = await gameDatabase.createGame({
                    ...finalData,
                    user_id: user.id,
                    secret_code_length: null
                 });

                if (insertedRowId) {
                    Alert.alert("Sucesso", "Jogo cadastrado!");
                    resetForm()

                    router.replace({
                        pathname: '/(panel)/add_game/created_game',
                        params: { game_id: insertedRowId }
                    })
                }
            }
           

            

            // Alert.alert("Sucesso", "Jogo cadastrado!");
            // resetForm(); 
            // router.replace('/(panel)/add_game/created_game');
        } catch (error) {
            console.error("Erro ao criar jogo:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o jogo.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.createGameTitle}>Criar jogo</Text>
            <BackButtonIcon
                style={styles.backButton}
                onPress={() => router.back()}
            />
            <View style={styles.containerInput}>
                <StyledInput
                    label="Título do jogo"
                    placeholder=""
                    value={formData.title}
                    onChangeText={(text: string) => updateFormData({ title: text })}
                />
                <StyledInput
                    label="Enunciado"
                    placeholder=""
                    value={formData.prompt}
                    onChangeText={(text: string) => updateFormData({ prompt: text })}
                />
                <StyledInput
                    label="Explicação"
                    placeholder=""
                    value={formData.explanation}
                    onChangeText={(text: string) => updateFormData({ explanation: text })}
                />
                {/* <Input 
                    placeholder="Enunciado" 
                    onChangeText={(text: string) => updateFormData({ prompt: text })} 
                    value={formData.prompt}
                />
                <Input 
                    placeholder="Explicação" 
                    onChangeText={(text: string) => updateFormData({ explanation: text })} 
                    value={formData.explanation}
                /> */}
            </View>
            <Pressable style={styles.continuarBtn} onPress={handleSaveGame}>
                <Text style={styles.continuarBtnTxt}>Criar jogo</Text>
            </Pressable>
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
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 40,
        zIndex: 1, 
    },
})