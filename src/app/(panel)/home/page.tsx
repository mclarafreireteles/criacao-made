import { View, Text, Button, Alert } from 'react-native'
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Home() {

    const { setAuth } = useAuth()

    async function handleSignout() {
        const {error} = await supabase.auth.signOut();

        setAuth(null);

        if (error) {
            Alert.alert('Erro ao deslogar', error.message)
        }
    }


    return(
        <View>
            <Text>Página Home</Text>

            <Button
                title='Deslogar'
                onPress={handleSignout}
            />
        </View>
    )
}