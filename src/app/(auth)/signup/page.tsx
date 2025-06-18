import { View, Text, TextInput, Pressable, Alert, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function Signup() {

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignup() {

        setLoading(true);

        if (password !== confirmPassword) {
            Alert.alert('As senhas devem ser iguais');
            console.log('senhas diferentes')
            setLoading(false);
            return
        }

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
        router.replace('/(auth)/signin/page')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../../../assets/images/tecnodocencia.png')} style={styles.logoTecno}/>
                <Image source={require('../../../../assets/images/logo-made.png')} style={styles.logoMade}/>
            </View>
            <Text style={styles.title}>Criar nova conta</Text>
            <View style={styles.containerInput}>
                <TextInput
                    placeholder='Nome'
                    value={name}
                    onChangeText={setName}
                    style={styles.inputRegister}
                />
                <TextInput
                    placeholder='E-mail'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.inputRegister}
                />
                <TextInput
                    placeholder='Senha'
                    value={password}
                    onChangeText={setPassword}
                    style={styles.inputRegister}
                />
                <TextInput
                    placeholder='Confirmar senha'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.inputRegister}
                /> 
            </View>
            <View style={styles.containerInput}>
                <Pressable onPress={handleSignup} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>{loading ? 'Carregando' : 'Cadastrar'}</Text>
                </Pressable>

                <Link href='/(auth)/signin/page'>
                    <Text>Já tem conta? Entrar</Text>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: Colors.light.white,
        paddingVertical: 50,
        paddingBottom: 120
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    logoMade: {
            width: 200,  // Defina a largura
            resizeMode: 'contain', // Garante que a imagem se ajuste dentro das dimensões,
    },
    logoTecno: {
        width: 100,  // Defina a largura
        resizeMode: 'contain', // Garante que a imagem se ajuste dentro das dimensões
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
    },
    containerInput:{
        display: 'flex',
        gap: 10,
        width: '70%',
        alignItems: 'center',   
    },
    inputRegister: {
        borderColor: Colors.light.grey,
        borderWidth: 1,
        borderRadius: 20,
        color: Colors.light.darkGrey,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: 500,
        width: '100%'
    },
    registerButton: {
        borderRadius: 20,
        backgroundColor: Colors.light.blue,
        color: Colors.light.white,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: 500,
        width: '100%'
    },
    registerButtonText:{
        color: Colors.light.white,
        textAlign: 'center',
        fontSize: 20
    },
})

