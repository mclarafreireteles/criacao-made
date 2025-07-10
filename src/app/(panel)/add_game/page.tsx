import { useState } from "react";
import { View, Button, Alert } from "react-native";
import { Input} from "@/src/components/input";
import { useGameDatabase} from "@/src/database/useGameDatabase";


export default function AddGame(){
    const [title, setTitle] = useState('')
    const [subject, setSubject] = useState('')
    const [user_id, setUserId] = useState('')
    const [goal, setGoal] = useState('')
    const [prompt, setPrompt] = useState('')

    const gameDatabase = useGameDatabase()

    async function create() {
        const response = await gameDatabase.create({ title, subject, user_id, goal, prompt })

        console.log('produto criado')
        Alert.alert("Produto cadastrado")
    }

    return(
        <View>
            <Input placeholder="Nome do jogo" onChangeText={setTitle} value={title}/>
            <Input placeholder="Disciplina" onChangeText={setSubject} value={subject}/>
            <Input placeholder="Usuário" onChangeText={setUserId} value={user_id}/>
            <Input placeholder="Objetivo" onChangeText={setGoal} value={goal}/>
            <Input placeholder="Enunciado" onChangeText={setPrompt} value={prompt}/>
            <Button title="Salvar" onPress={create} />
        </View>
    )
}