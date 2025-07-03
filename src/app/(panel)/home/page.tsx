import { View, Text, Button, Alert, Image, StyleSheet, Pressable } from 'react-native'
import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Home() {

    const { setAuth, user } = useAuth()

    async function handleSignout() {
        const {error} = await supabase.auth.signOut();

        setAuth(null);

        if (error) {
            Alert.alert('Erro ao deslogar', error.message)
        }
    }


    return(
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <View style={styles.header}>
                    <Image source={require('../../../../assets/images/logo-made-simples.png')}/>
                    <View style={styles.headerUserinfo}>
                        <Text>{user?.user_metadata.name}</Text>
                        <Text style={styles.roleText}>{user?.user_metadata.role}</Text>
                        <Pressable
                            onPress={handleSignout} style={styles.btnSair}
                        >
                            <MaterialIcons name="logout" size={15} color="#000" />
                            <Text style={styles.btnSairText}>Sair</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={styles.bemvindoText}>Bem vindo(a)!</Text>
            </View>
            
            <View style={styles.containerBtn}> 
                <View style={styles.btnJogar}>
                    <Ionicons name="game-controller" size={50} color={Colors.light.white} />
                    <Text style={styles.btnJogarText}>Jogar</Text>
                </View>
                <View style={styles.btnCriarJogo}>
                    <Ionicons name="add-circle" size={50} color={Colors.light.blue} />
                    <Text style={styles.btnCriarJogoText}>Criar novo jogo</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        paddingVertical: 50,
        alignItems: 'center',
        backgroundColor: Colors.light.white,
        maxWidth: '100%'
    },
    containerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 250,
        paddingHorizontal: 50
    },
    btnSair: {
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnSairText: {
        fontWeight: 500,
        paddingBottom: 2
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20
    },
    headerUserinfo: {
        alignItems: 'flex-end',
    },
    bemvindoText: {
        fontSize: 32,
        fontWeight: 600
    },
    roleText: {
        textTransform: 'capitalize',
        marginBottom: 5
    },
    containerBtn: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        gap: 50
    },
    btnJogar: {
        minWidth: 120,
        backgroundColor: Colors.light.blue,
        alignItems: 'center',
        minHeight: 120,
        justifyContent: 'center',
        borderRadius: 20
    },
    btnJogarText: {
        color: Colors.light.white,
        fontWeight: 500
    },
    btnCriarJogo: {
        minWidth: 120,
        backgroundColor: Colors.light.white,
        alignItems: 'center',
        minHeight: 120,
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.light.blue
    },
    btnCriarJogoText: {
        color: Colors.light.blue,
        fontWeight: 500
    }
})