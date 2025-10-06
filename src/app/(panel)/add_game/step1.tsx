import { View, Button, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import Colors from "@/constants/Colors";
import { OptionSelector } from "@/src/components/OptionSelector";
import { StyledInput } from "@/src/components/StyledInput";
import { BackButtonIcon } from "@/src/components/icons/BackButtonIcon";
import { disciplines, grade } from "@/constants/formOptions";

export default function Step1(){
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    const isEditing = formData.id !== null;

    const gameModels = [
        {id: 'secret_code', label: 'Código secreto'},
    ]

    const handleNextStep =() => {
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

    return(
        <View style={styles.container}>
            <BackButtonIcon
                        style={styles.backButton}
                        onPress={() => router.back()}
                    />
            <Text style={styles.createGameTitle}>{isEditing ? "Editar Jogo" : "Criar Jogo"}</Text>
            <View style={styles.containerInput}>
                <View>
                    <Text>Escolha o modelo de jogo</Text>
                    <View style={styles.optionsContainer}>
                        {gameModels.map((model) => (
                            <Pressable
                                key={model.id}
                                onPress={() => updateFormData({ model: model.id })}
                                // Aplica um estilo diferente se este for o modelo selecionado
                                style={[
                                styles.option,
                                formData.model === model.id && styles.optionSelected,
                                ]}
                            >
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
                        // onSelect={(id) => updateFormData({ subject: id })}
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
                            if (id !== 'outro'){
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
    },
    option: {
        borderWidth: 1,
        borderColor: Colors.light.grey,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#FFF',
    },
    optionSelected: {
        backgroundColor: Colors.light.blue, 
        borderColor: Colors.light.blue,
    },
    optionText: {
        color: Colors.light.darkGrey,
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
})