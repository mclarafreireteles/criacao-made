import { View, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/input";
import { useGameForm } from "@/src/contexts/GameFormContext";
import { useAuth } from '@/src/contexts/AuthContext';
import { useGameDatabase } from "@/src/database/useGameDatabase";

export default function Step3() {
    const router = useRouter();
    const { user } = useAuth();
    const gameDatabase = useGameDatabase();
    const { formData, updateFormData, resetForm } = useGameForm();

    async function handleCreateGame() {
        if (!user?.id) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login para continuar.");
            return;
        }

        const requiredFields = {
            title: 'Título do jogo',
            subject: 'Disciplina',
            goal: 'Objetivo',
            prompt: 'Enunciado',
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field as keyof typeof formData]?.trim()) {
                Alert.alert('Campo Obrigatório', `O campo "${label}" não pode estar vazio.`);
                return;
            }
        }

        try {
            const finalData = { ...formData, user_id: user.id };

            await gameDatabase.create(finalData);

            Alert.alert("Sucesso", "Jogo cadastrado!");
            resetForm(); 
            router.replace('/(panel)/add_game/created_game');
        } catch (error) {
            console.error("Erro ao criar jogo:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o jogo.");
        }
    }

    return (
        <View>
            <Input 
                placeholder="Título do jogo" 
                onChangeText={(text: string) => updateFormData({ title: text })} 
                value={formData.title}
            />
            <Input 
                placeholder="Enunciado" 
                onChangeText={(text: string) => updateFormData({ prompt: text })} 
                value={formData.prompt}
            />
            <Input 
                placeholder="Explicação" 
                onChangeText={(text: string) => updateFormData({ explanation: text })} 
                value={formData.explanation}
            />

            <Button title="Voltar" onPress={() => router.back()} />
            <Button title="Salvar Jogo" onPress={handleCreateGame} />
        </View>
    );
}