import { View, Button, Text, StyleSheet, Pressable, Alert, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useGameForm } from "@/src/contexts/GameFormContext";
import Colors from "@/constants/Colors";
import { OptionSelector } from "@/src/components/OptionSelector";
import { StyledInput } from "@/src/components/StyledInput";
import { disciplines, grade } from "@/constants/formOptions";
import { AppButton } from "@/src/components/AppButton";
import { ScreenContainer } from "@/src/components/ScreenContainer";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { GLOBAL_FONT } from "@/src/components/Fonts";

export default function Step1() {
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    const isEditing = formData.id !== null;

    const gameModels = [
        { id: 'secret_code', label: 'Código secreto', icon: require('@/assets/images/game_models/secret_code.png') },
    ]

    const handleNextStep = () => {
        const requiredFields = {
            model: 'Modelo de jogo',
            subject: 'Disciplina',
            content: 'Conteúdo',
            grade: 'Série',
            authors: 'Autores',
        }


        for (const field in requiredFields) {
            const key = field as keyof typeof requiredFields;
            if (!formData[key]?.trim()) {
                Alert.alert('Campo Obrigatório', `Por favor, preencha o campo "${requiredFields[key]}".`);
                return;
            }
        }

        router.push('/(panel)/add_game/step2');
    }

    return (
        <ScreenContainer>
            <ScreenHeader title={isEditing ? "Editar Jogo" : "Criar Jogo"} />
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.labelText}>Escolha o modelo de jogo</Text>
                    <View style={styles.optionsContainer}>
                        {gameModels.map((model) => (
                            <Pressable
                                key={model.id}
                                onPress={() => updateFormData({ model: model.id })}
                                style={[
                                    styles.option,
                                    formData.model === model.id && styles.optionSelected, styles.optionWithImage
                                ]}
                            >
                                {model.icon && (
                                    <Image
                                        source={model.icon}
                                        style={styles.modelIcon}
                                    />
                                )}
                                <Text
                                    style={[
                                        styles.optionText,
                                        formData.model === model.id && styles.optionTextSelected,
                                    ]}
                                >
                                    {model.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <View>
                    <OptionSelector
                        label="Disciplina"
                        options={disciplines}
                        selectedValue={formData.subject}
                        onSelect={(id) => {
                            updateFormData({ subject: id });
                            if (id !== 'outro') {
                                updateFormData({ subject_other: '' })
                            }
                        }}
                    />
                </View>
                <View>
                    {formData.subject === 'outro' && (
                        <StyledInput
                            label="Qual a disciplina?"
                            placeholder="Digite o nome da disciplina"
                            value={formData.subject_other}
                            onChangeText={(text) => updateFormData({ subject_other: text })}
                        />
                    )}
                </View>
                <View>
                    <StyledInput
                        label="Conteúdo"
                        placeholder=""
                        value={formData.content}
                        onChangeText={(text: string) => updateFormData({ content: text })}
                    />
                </View>
                <View>
                    <OptionSelector
                        label="Série"
                        options={grade}
                        selectedValue={formData.grade}
                        onSelect={(id) => {
                            updateFormData({ grade: id });
                            if (id !== 'outro') {
                                updateFormData({ grade_other: '' })
                            }
                        }}
                    />
                </View>
                <View>
                    {formData.grade === 'outro' && (
                        <StyledInput
                            label="Qual a série?"
                            placeholder="Digite a série"
                            value={formData.grade_other}
                            onChangeText={(text) => updateFormData({ grade_other: text })}
                        />
                    )}
                </View>
                <View>
                    <StyledInput
                        label="Autores"
                        placeholder=""
                        value={formData.authors}
                        onChangeText={(text: string) => updateFormData({ authors: text })}
                    />
                </View>
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
        marginBottom: 20
    },
    containerInput: {
        minWidth: '80%',
    },
    inputText: {
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 20,
        borderColor: Colors.light.grey
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
        marginTop: 10,
    },
    option: {
        borderWidth: 1,
        borderColor: Colors.light.grey,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        gap: 8
    },
    optionSelected: {
        backgroundColor: Colors.light.blue,
        borderColor: Colors.light.blue,
    },
    optionText: {
        color: Colors.light.darkGrey,
        fontFamily: GLOBAL_FONT
    },
    optionTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
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
    backButton: {
        position: 'absolute',
        top: 60,
        left: 40,
        zIndex: 1,
    },
    modelIcon: {
        width: 100,
        height: 100,
        marginRight: 8,
        resizeMode: 'contain',
    },
    optionWithImage: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    footer: {
        paddingTop: 20,
        gap: 12,
        paddingHorizontal: 45
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 45
    },
    labelText: {
        fontSize: 16,
        color: '#333',
        fontFamily: GLOBAL_FONT
    }
})