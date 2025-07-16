import { useState } from "react";
import { View, Button, Alert } from "react-native";
import { Input} from "@/src/components/input";
import { useGameDatabase} from "@/src/database/useGameDatabase";
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';


export default function AddGame(){
    const router = useRouter();
    const { setAuth, user } = useAuth()

    const [title, setTitle] = useState('')
    const [subject, setSubject] = useState('')
    const [user_id, setUserId] = useState('')
    const [goal, setGoal] = useState('')
    const [prompt, setPrompt] = useState('')
    const [content, setContent] = useState('')
    const [grade, setGrade] = useState('')
    const [authors, setAuthors] = useState('')
    const [rules, setRules] = useState('')
    const [background_image_url, setBackgroundImageUrl] = useState('')
    const [explanation, setExplanation] = useState('')

    const gameDatabase = useGameDatabase()

    async function create() {
        if (!user || !user.id) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login para continuar.");
            return; // Interrompe a execução da função
        }

        const response = await gameDatabase.create({ title, subject, user_id: user?.id, goal, prompt, content, grade, authors, rules, background_image_url, explanation})

        console.log('jogo criado')
        Alert.alert("Jogo cadastrado")
    }


    return(
        <View>
            <Input placeholder="Nome do jogo" onChangeText={setTitle} value={title}/>
            <Input placeholder="Disciplina" onChangeText={setSubject} value={subject}/>
            <Input placeholder="Usuário" onChangeText={setUserId} value={user_id}/>
            <Input placeholder="Objetivo" onChangeText={setGoal} value={goal}/>
            <Input placeholder="Enunciado" onChangeText={setPrompt} value={prompt}/>
            <Input placeholder="Conteúdo" onChangeText={setContent} value={content}/>
            <Input placeholder="Série" onChangeText={setGrade} value={grade}/>
            <Input placeholder="Autores" onChangeText={setAuthors} value={authors}/>
            <Input placeholder="Regras" onChangeText={setRules} value={rules}/>
            <Input placeholder="Plano de fundo do jogo" onChangeText={setBackgroundImageUrl} value={background_image_url}/>
            <Input placeholder="Explicação" onChangeText={setExplanation} value={explanation}/>
            <Button title="Salvar" onPress={create} />
        </View>
    )
}