import { View, Text, StyleSheet, Pressable } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import Colors from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { GLOBAL_FONT } from "@/src/components/Fonts"

export default function CreatedGame(){
    const router = useRouter();

    const { game_id } = useLocalSearchParams();

    const handleCreateCards = () => {
        router.push({
            pathname: '/(panel)/manage_cards/page',
            params: { game_id }
        });
    };

    
    const handleBackToMenu = () => {
        router.replace('/(panel)/home/page')
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Jogo criado</Text>

            <Ionicons name="checkmark-circle-outline" size={60} color="white" style={styles.icon} />

            <View style={styles.containerBtn}>
                <Pressable onPress={handleCreateCards} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Criar cartas</Text>
                </Pressable>

                <Pressable onPress={handleBackToMenu} style={styles.secondaryLink}>
                    <Text style={styles.secondaryLinkText}>Voltar para o menu</Text>
                </Pressable>
            </View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.light.blue,
        justifyContent: 'center',
        alignItems: 'center',     
    },
    containerBtn: {
        position: 'absolute',  
        bottom: 90,            
        width: '100%',         
        alignItems: 'center'
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16, 
        fontFamily: GLOBAL_FONT
    },
    icon: {
        marginBottom: 80, 
    },
    primaryButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 120,
        borderRadius: 20, 
        marginBottom: 20,
    },
    primaryButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: GLOBAL_FONT,
    },
    secondaryLink: {
    },
    secondaryLinkText: {
        color: 'white',
        fontSize: 16,
        fontFamily: GLOBAL_FONT
    }
})