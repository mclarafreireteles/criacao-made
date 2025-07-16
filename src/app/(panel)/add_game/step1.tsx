import { View, Button } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";

export default function Step1(){
    const router = useRouter();
    const { formData, updateFormData } = useGameForm();

    return(
        <View>
            <Input
                placeholder="Modelo de jogo"
                onChangeText={(text: string) => updateFormData({ model: text })}
                value={formData.model}
            />
            <Input
                placeholder="Disciplina"
                onChangeText={(text: string) => updateFormData({ subject: text })}
                value={formData.subject}
            />
            <Input
                placeholder="Conteúdo"
                onChangeText={(text: string) => updateFormData({ content: text })}
                value={formData.content}
            />
            <Input
                placeholder="Série"
                onChangeText={(text: string) => updateFormData({ grade: text })}
                value={formData.grade}
            />
            <Input
                placeholder="Autores"
                onChangeText={(text: string) => updateFormData({ authors: text })}
                value={formData.authors}
            />

            <Button title="Próximo" onPress={() => router.push('/(panel)/add_game/step2')}/>
        </View>
    )
}