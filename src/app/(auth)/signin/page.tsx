import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router'
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { router } from 'expo-router';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignin() {
        setLoading(true);

        console.log('entrar')

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            Alert.alert('Erro ao criar conta', error.message);
            setLoading(false);
            return
        }

        setLoading(false);
        router.replace('/(panel)/home/page')

    }

    return (
        <View>
            <Text>Página Login</Text>
            <View>
                <View>
                    <Text>Email</Text>
                    <TextInput
                        placeholder='Digite seu e-mail'
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View>
                    <Text>Senha</Text>
                    <TextInput
                        placeholder='Digite sua senha'
                        value={password}
                        onChangeText    ={setPassword}
                    />
                </View>

                <Pressable onPress={handleSignin}>
                    <Text>{loading ? 'Carregando...' : 'Fazer log in'}</Text>
                </Pressable>

                <Link href='/(auth)/signup/page'>
                    <Text>Ainda não tenho conta? Se registrar</Text>
                </Link>
            </View>
        </View>
    )
}

