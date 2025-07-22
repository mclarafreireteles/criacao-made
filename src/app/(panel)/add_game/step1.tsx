import { View, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import Colors from "@/constants/Colors";

export default function Step1(){
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    return(
        <View style={styles.container}>
            <Text style={styles.createGameTitle}>Criar jogo</Text>
            <View style={styles.containerInput}>
                <View>
                    <Text>Escolha o modelo de jogo</Text>
                    <Input
                    placeholder="Modelo de jogo"
                    onChangeText={(text: string) => updateFormData({ model: text })}
                    value={formData.model}
                    />
                </View>
                <View>
                    <Text>Disciplina</Text>
                    <Input
                        placeholder="Disciplina"
                        onChangeText={(text: string) => updateFormData({ subject: text })}
                        value={formData.subject}
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
    }
})