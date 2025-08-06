import { View, Text, StyleSheet } from "react-native"
import { Link } from "expo-router"
import Colors from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"

export default function CreatedGame(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Jogo criado</Text>

            <Ionicons name="checkmark-circle-outline" size={60} color="white" style={styles.icon} />

            <View style={styles.containerBtn}>
                <Link href='/(panel)/add_game/created_game' style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Criar cartas</Text>
                </Link>

                <Link href='/(panel)/home/page' style={styles.secondaryLink}>
                    <Text style={styles.secondaryLinkText}>Voltar para o menu</Text>
                </Link>
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
    },
    secondaryLink: {
    },
    secondaryLinkText: {
        color: 'white',
        fontSize: 16,
    }
})