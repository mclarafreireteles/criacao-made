import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';

export default function Signup() {

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignup() {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        })

        if (error) {
            Alert.alert('Erro ao cadastrar', error.message)
            console.log(error.message   )
            setLoading(false);
            return
        }

        setLoading(false);
        router.replace('/')
    }

    return (
        <View>
            <Text>Página de Registro</Text>
            <View>
                <View>
                    <Text>Nome completo</Text>
                    <TextInput
                        placeholder='Digite seu nome'
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View>
                    <Text>Aluno/professor</Text>
                    <TextInput
                        placeholder='Digite seu nome'
                        value={role}
                        onChangeText={setRole}
                    />
                </View>
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
                        onChangeText={setPassword}
                    />
                </View>

                <Pressable onPress={handleSignup}>
                    <Text>{loading ? 'Carregando' : 'Cadastrar'}</Text>
                </Pressable>

                <Link href='/(auth)/signin/page'>
                    <Text>Já tem conta? Entrar</Text>
                </Link>
            </View>
        </View>
    )
}

