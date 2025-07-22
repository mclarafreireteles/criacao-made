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
        {id: 'senha', label: 'Senha'},
    ]

    const disciplines = [
        { id: 'matematica', label: 'Matemática' },
        { id: 'portugues', label: 'Português' },
        { id: 'historia', label: 'História' },
        { id: 'ciencias', label: 'Ciências' },
        { id: 'geografia', label: 'Geografia' },
        { id: 'artes', label: 'Artes' },
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
                    <Text>Disciplina</Text>
                    <Input
                        placeholder="Disciplina"
                        onChangeText={(text: string) => updateFormData({ subject: text })}
                        value={formData.subject}
                    />
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
                    <Text>Série</Text>
                    <Input
                        placeholder="Série"
                        onChangeText={(text: string) => updateFormData({ grade: text })}
                        value={formData.grade}
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
                <Button title="Continuar" onPress={() => router.push('/(panel)/add_game/step2')}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        paddingVertical: 50,
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
        paddingHorizontal: 10,
        paddingVertical: 8,
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
        backgroundColor: Colors.light.tint, // Cor de destaque para o item selecionado
        borderColor: Colors.light.tint,
    },
    optionText: {
        color: Colors.light.darkGrey,
    },
    optionTextSelected: {
        color: '#FFF', // Cor do texto do item selecionado
        fontWeight: 'bold',
    }
})