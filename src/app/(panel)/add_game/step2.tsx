    import { View, Button, StyleSheet, Text, Pressable, Alert } from "react-native";
    import { useRouter } from "expo-router";
    import { Input } from "@/src/components/input";
    import { useGameForm } from "@/src/contexts/GameFormContext";
    import Colors from "@/constants/Colors";
    import { StyledInput } from "@/src/components/StyledInput";
    import { BackButtonIcon } from "@/src/components/icons/BackButtonIcon";

    export default function Step1(){
        const router = useRouter();
        const { formData, updateFormData } = useGameForm();

        const isEditing = formData.id !== null;

        const handleNextStep =() => {
                const requiredFields = {
                    rules: 'Regras',
                    goal: 'Objetivo',
                }
        
                for (const field in requiredFields) {
                    const key = field as keyof typeof requiredFields;
                    if (!formData[key]?.trim()) {
                        Alert.alert('Campo Obrigatório', `Por favor, preencha o campo "${requiredFields[key]}".`);
                        return;
                    }
                }
        
                router.push('/(panel)/add_game/step3');
            }

        return(
            <View style={styles.container}>
                <BackButtonIcon
                    style={styles.backButton}
                    onPress={() => router.back()}
                />
                <Text style={styles.createGameTitle}>{isEditing ? "Editar Jogo" : "Criar Jogo"}</Text>
                <View style={styles.containerInput}>
                    <StyledInput
                        label="Regras"
                        placeholder=""
                        value={formData.rules}
                        onChangeText={(text: string) => updateFormData({ rules: text })}
                    />
                    <StyledInput
                        label="Objetivo"
                        placeholder=""
                        value={formData.goal}
                        onChangeText={(text: string) => updateFormData({ goal: text })}
                    />
                    <Input
                        placeholder="Fundo de tela do jogo"
                        onChangeText={(text: string) => updateFormData({ background_image_url: text })}
                        value={formData.background_image_url}
                    />
                </View>
                <Pressable style={styles.continuarBtn} onPress={handleNextStep}>
                    <Text style={styles.continuarBtnTxt}>Continuar</Text>
                </Pressable>
            </View>
        )
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
            backgroundColor: '#FFF',
            width: '80%'
        },
        continuarBtnTxt: {
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 600,
            color: Colors.light.blue
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