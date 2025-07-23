import { View, Button, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import Colors from "@/constants/Colors";
import { OptionSelector } from "@/src/components/OptionSelector";

export default function Step1(){
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    const gameModels = [
        {id: 'secret_code', label: 'Código secreto'},
    ]

    const disciplines = [
        { id: 'matematica', label: 'Matemática' },
        { id: 'portugues', label: 'Português' },
        { id: 'historia', label: 'História' },
        { id: 'ciencias', label: 'Ciências' },
        { id: 'geografia', label: 'Geografia' },
        { id: 'artes', label: 'Artes' },
    ];
    const grade = [
        { id: '1ef', label: '1º Ano - Ens. Fundamental' },
        { id: '2ef', label: '2º Ano - Ens. Fundamental' },
        { id: '3ef', label: '3º Ano - Ens. Fundamental' },
        { id: '4ef', label: '4º Ano - Ens. Fundamental' },
        { id: '5ef', label: '5º Ano - Ens. Fundamental' },
        { id: '6ef', label: '6º Ano - Ens. Fundamental' },
        { id: '7ef', label: '7º Ano - Ens. Fundamental' },
        { id: '8ef', label: '8º Ano - Ens. Fundamental' },
        { id: '9ef', label: '9º Ano - Ens. Fundamental' },
        { id: 'em', label: 'Ensino Médio' },
        { id: 'outro', label: 'Outro' },
    ];

    return(
        <View style={styles.container}>
            <Text style={styles.createGameTitle}>Criar jogo</Text>
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
                    {/* <Input
                        placeholder="Disciplina"
                        onChangeText={(text: string) => updateFormData({ subject: text })}
                        value={formData.subject}
                    /> */}
                    <OptionSelector
                        label="Disciplina"
                        options={disciplines}
                        selectedValue={formData.subject}
                        onSelect={(id) => updateFormData({ subject: id })}
                    />
                </View>
                <View>
                    <Text>Conteúdo</Text>
                    <Input
                        placeholder="Conteúdo"
                        onChangeText={(text: string) => updateFormData({ content: text })}
                        value={formData.content}
                        style={styles.inputText}
                    />
                </View>
                <View>
                    {/* <Text>Série</Text>
                    <Input
                        placeholder="Série"
                        onChangeText={(text: string) => updateFormData({ grade: text })}
                        value={formData.grade}
                    /> */}
                    <OptionSelector
                        label="Série"
                        options={grade}
                        selectedValue={formData.grade}
                        onSelect={(id) => updateFormData({ grade: id })}
                    />
                </View>
                <View>
                    <Text>Autores</Text>
                    <Input
                        placeholder="Autores"
                        onChangeText={(text: string) => updateFormData({ authors: text })}
                        value={formData.authors}
                        style={styles.inputText}
                    />
                </View>
            </View>
            <Pressable style={styles.continuarBtn} onPress={() => router.push('/(panel)/add_game/step2')}>
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
    }
})