import { View, Button, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";

export default function Step1(){
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    return(
        <View>
            <Text style={styles.createGameTitle}>Criar jogo</Text>
            <View>
                <Input
                placeholder="Regras"
                onChangeText={(text: string) => updateFormData({ rules: text })}
                value={formData.rules}
                />
                <Input
                    placeholder="Objetivo"
                    onChangeText={(text: string) => updateFormData({ goal: text })}
                    value={formData.goal}
                />
                <Input
                    placeholder="Fundo de tela do jogo"
                    onChangeText={(text: string) => updateFormData({ background_image_url: text })}
                    value={formData.background_image_url}
                />
            </View>
            <Button title="Próximo" onPress={() => router.push('/(panel)/add_game/step3')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    createGameTitle: {
        fontSize: 24,
    },
})