import { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";

import { Game } from "@/src/components/Game";

import { useGameDatabase} from "@/src/database/useGameDatabase";
import { GameDatabase } from "@/src/database/useGameDatabase";

import { useAuth } from '@/src/contexts/AuthContext';

export default function ChooseGame(){

    const gameDatabase = useGameDatabase()
    const { user } = useAuth()

    const [search, setSearch] = useState('')
    const [games, setGames] = useState<GameDatabase[]>([])

    async function list(){

        if (!user) {
            setGames([]);
            return
        }

        try {
            console.log(`Listing games for user ${user.id}...`)
            const response = await gameDatabase.searchByUser(user.id);
            setGames(response);
        } catch (error) {
            console.log("Erro ao listar jogos", error)
        }
    }

    useEffect(() => {
        list()
    }, [search, user])
    
    return (
        <View>
            <FlatList 
                data={games} 
                keyExtractor={(item) => String(item.id)} 
                renderItem={({ item }) => <Game data={item}/>}
                ListEmptyComponent={() => (
                    <Text>
                        Nenhum jogo ainda criado
                    </Text>
                )}
            />
        </View>
    )
}