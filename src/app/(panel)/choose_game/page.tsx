import { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Game } from "@/src/components/Game";

import { useGameDatabase} from "@/src/database/useGameDatabase";
import { GameDatabase } from "@/src/database/useGameDatabase";

import { useAuth } from '@/src/contexts/AuthContext';
import Colors from "@/constants/Colors";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenContainer } from "@/src/components/ScreenContainer";

import { GLOBAL_FONT } from "@/src/components/Fonts";

export default function ChooseGame(){
    const router = useRouter()

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
            console.log('CHOOSE GAME SCREEN - Buscando jogos para o User ID:', user.id);
            const response = await gameDatabase.searchGameByUser(user.id);

            console.log("--- DADOS ENCONTRADOS NO SQLITE ---");
            console.log(`Encontrados ${response.length} jogos.`);
            console.log(JSON.stringify(response, null, 2));
            console.log("------------------------------------");

            setGames(response);
        } catch (error) {
            console.log("Erro ao listar jogos", error)
        }
    }

    useEffect(() => {
        list()
    }, [search, user]);

    
    
    return (
        <ScreenContainer>
            <ScreenHeader title="Escolher jogos" backHref={'/(panel)/home/page'}/>
            <FlatList 
                data={games} 
                keyExtractor={(item) => String(item.id)} 
                renderItem={({ item }) => <Game data={item}/>}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>
                        Nenhum jogo ainda criado
                    </Text>
                )}
                contentContainerStyle={games.length === 0 ? styles.emptyListStyle : styles.listStyle}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    emptyText: {
        fontSize: 16,
        color: Colors.light.darkGrey,
        textAlign: 'center',
        fontFamily: GLOBAL_FONT
    },
    emptyListStyle: {
        flexGrow: 1,            
        justifyContent: 'center', 
        alignItems: 'center',    
    },
    listStyle: {
        justifyContent: 'center', 
    }
})