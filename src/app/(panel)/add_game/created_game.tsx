import { View, Text } from "react-native"
import { Link } from "expo-router"

export default function CreatedGame(){
    return(
        <View>
            <Text>Jogo criado!</Text>
            <Link href='/(panel)/choose_game/page'>
                <Text>Ir para jogos criados</Text>
            </Link>
        </View>
    )
}