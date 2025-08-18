import { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Game } from "@/src/components/Game";

import { useGameDatabase} from "@/src/database/useGameDatabase";
import { GameDatabase } from "@/src/database/useGameDatabase";

import { useAuth } from '@/src/contexts/AuthContext';
import Colors from "@/constants/Colors";
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
            setGames(response);
        } catch (error) {
            console.log("Erro ao listar jogos", error)
        }
    }

    useEffect(() => {
        list()
    }, [search, user])
    
    return (
        <View style={styles.container}>
            <BackButtonIcon
                style={styles.backButton}
                onPress={() => router.back()}
            />
            <Text style={styles.chooseGameTitle}>Escolher jogo</Text>
            <FlatList 
                data={games} 
                keyExtractor={(item) => String(item.id)} 
                renderItem={({ item }) => <Game data={item}/>}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>
                        Nenhum jogo ainda criado
                    </Text>
                )}
                contentContainerStyle={games.length === 0 ? styles.emptyListStyle : {}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    }
})