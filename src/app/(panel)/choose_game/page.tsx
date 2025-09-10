import { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Game } from "@/src/components/Game";

import { useGameDatabase} from "@/src/database/useGameDatabase";
import { GameDatabase } from "@/src/database/useGameDatabase";

import { useAuth } from '@/src/contexts/AuthContext';
import Colors from "@/constants/Colors";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenContainer } from "@/src/components/ScreenContainer";

import { BackButtonIcon } from "@/src/components/icons/BackButtonIcon";

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
            const response = await gameDatabase.searchByUser(user.id);

            console.log("--- DADOS ENCONTRADOS NO SQLITE ---");
            console.log(`Encontrados ${response.length} jogos.`);
            console.log(JSON.stringify(response, null, 2)); // Mostra os dados formatados
            console.log("------------------------------------");

            setGames(response);
        } catch (error) {
            console.log("Erro ao listar jogos", error)
        }
    }

    useEffect(() => {
        list()
    }, [search, user])
    
    return (
        <ScreenContainer>
            <ScreenHeader title="Escolher jogos" />
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
    container: {
        paddingHorizontal: 30, 
        paddingVertical: 60,
        backgroundColor: Colors.light.white,
        flex: 1
    },
    chooseGameTitle: {
        fontSize: 24,
        alignSelf: 'center',
        marginBottom: 30,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 40,
        zIndex: 1, 
    },
    emptyText: {
        fontSize: 16,
        color: Colors.light.darkGrey,
        textAlign: 'center',
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