import { View, Button, StyleSheet, Text, Pressable, Alert, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import Colors from "@/constants/Colors";
import { StyledInput } from "@/src/components/StyledInput";
import { BackButtonIcon } from "@/src/components/icons/BackButtonIcon";
import { cardBacks } from "@/constants/cardBacks";
import { ScreenContainer } from "@/src/components/ScreenContainer";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from "@/src/components/AppButton";
import { GLOBAL_FONT } from "@/src/components/Fonts";

export default function Step2() {
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    const isEditing = formData.id !== null;

    const handleNextStep = () => {
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

    return (
        <ScreenContainer>
            <ScreenHeader title={isEditing ? "Editar Jogo" : "Criar Jogo"} />
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                <StyledInput
                    label="Regras do jogo"
                    placeholder=""
                    value={formData.rules}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(text: string) => updateFormData({ rules: text })}
                />
                <StyledInput
                    label="Objetivo"
                    placeholder=""
                    multiline={true}
                    numberOfLines={4}
                    value={formData.goal}
                    onChangeText={(text: string) => updateFormData({ goal: text })}
                />

                <Text style={styles.label}>Fundo da Carta</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardBackSelector}>
                    {cardBacks.map((back) => (
                        <Pressable
                            key={back.id}
                            onPress={() => updateFormData({ background_image_url: back.id })}
                            style={[
                                styles.cardBackOption,
                                formData.background_image_url === back.id && styles.cardBackSelected
                            ]}
                        >
                            <Image source={back.image} style={styles.cardBackImage} />
                        </Pressable>
                    ))}
                </ScrollView>

            </ScrollView>
            <View style={styles.footer}>
                <AppButton title="Continuar" variant="secondary" onPress={handleNextStep} />
            </View>
        </ScreenContainer>
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
    cardBackSelector: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    cardBackOption: {
        width: 90,
        height: 120,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: 'transparent',
        overflow: 'hidden',
        marginRight: 15,
    },
    cardBackSelected: {
        borderColor: Colors.light.blue,
    },
    cardBackImage: {
        width: '100%',
        height: '100%',
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontFamily: GLOBAL_FONT
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 45
    },
    footer: {
        paddingTop: 20,
        gap: 12,
        paddingHorizontal: 45
    },
})