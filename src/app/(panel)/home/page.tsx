import { View, Text, Button, Alert, Image, StyleSheet } from 'react-native'
import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';

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
                    <View>
                        <Text>{user?.user_metadata.name}</Text>
                        <Text>{user?.user_metadata.role}</Text>
                        <Button
                            title='Deslogar'
                            onPress={handleSignout}
                        />
                    </View>
                </View>
                <Text>Bem vindo(a)!</Text>
            </View>
            
            <View style={styles.containerBtn}> 
                <View style={styles.btnJogar}>
                    <Text>Jogar</Text>
                </View>
                <View style={styles.btnCriarJogo}>
                    <Text>Criar novo jogo</Text>
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
        paddingHorizontal: 30,
        backgroundColor: Colors.light.white,
    },
    containerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 250
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    btnCriarJogo: {
        minWidth: 120,
        backgroundColor: Colors.light.white,
        alignItems: 'center',
        minHeight: 120,
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.light.blue
    }
})