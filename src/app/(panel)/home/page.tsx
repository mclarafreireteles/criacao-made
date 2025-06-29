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
            <View>
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
            <View> 
                <View>
                    <Text>Jogar</Text>
                </View>
                <View>
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
        justifyContent: 'space-between',
        paddingVertical: 50,
        alignItems: 'center',
        backgroundColor: Colors.light.white
    }
})