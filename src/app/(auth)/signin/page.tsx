import React from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'
import { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
// import Icon from 'react-native-vector-icons/Feather';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordInputRef = useRef<TextInput>(null);

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
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../../../assets/images/tecnodocencia.png')} style={styles.logoTecno}/>
                <Image source={require('../../../../assets/images/logo-made.png')} style={styles.logoMade}/>
            </View>
            <Text style={styles.title}>Entre na sua conta</Text>
            <View style={styles.inputContainer}>
                <View>
                    <TextInput
                        placeholder='Digite seu e-mail'
                        value={email}
                        onChangeText={setEmail}
                        style={styles.inputLogin}
                    />
                </View>
                <Pressable onPress={() => passwordInputRef.current?.focus()}>
                    <View style={styles.inputLoginPassword}>
                        <TextInput
                            ref={passwordInputRef}
                            placeholder='Digite sua senha'
                            value={password}
                            onChangeText={setPassword}
                            style={styles.inputPassword}
                            secureTextEntry={!isPasswordVisible}
                            autoCorrect={false}
                            autoCapitalize="none"
                            textContentType="password" 
                        />
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {/* <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" /> */}
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </View>
            <View style={styles.buttons}>
                 <Pressable onPress={handleSignin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>{loading ? 'Carregando...' : 'Entrar'}</Text>
                </Pressable>

                <Link style={styles.signUpText} href='/(auth)/signup/page'>
                    <Text>Ainda não tem uma conta?{'\n'}Se inscreva</Text>
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
        width: 200,  
        resizeMode: 'contain',
    },
    logoTecno: {
        width: 100,  
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
    },
    inputContainer: {
        display: 'flex',
        gap: 10,
        width: '70%'
    },
    inputLogin: {
        borderColor: Colors.light.grey,
        borderWidth: 1,
        borderRadius: 20,
        color: Colors.light.darkGrey,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: 500,
        minHeight: 45
    },
    loginButton: {
        borderRadius: 20,
        backgroundColor: Colors.light.blue,
        color: Colors.light.white,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: 500,
        width: '100%'
    },
    loginButtonText:{
        color: Colors.light.white,
        textAlign: 'center',
        fontSize: 20
    },
    buttons: {
        display: 'flex',
        gap: 10,
        width: '70%',
        alignItems: 'center'
    },
    signUpText: {
        textAlign: 'center'
    },
    inputLoginPassword: {
        borderColor: Colors.light.grey,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        // paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 45
        // borderBottomWidth: 1,
    },
    inputPassword: {
        flex: 1,
        color: Colors.light.darkGrey,
        fontSize: 14,
        fontWeight: 500,
    },
    icon: {

    }
})


