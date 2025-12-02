import React from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'
import { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { LoginInput } from '@/src/components/LoginInput';
import { AppText } from '@/src/components/AppText';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    const passwordInputRef = useRef<TextInput>(null);

    async function handleSignin() {
        if (loading) return;

        setLoading(true);

        console.log('entrar')

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            Alert.alert('Falha no login', 'E-mail ou senha inválidos. Por favor, verifique seus dados.');
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
                <Text style={styles.title}>Entre na sua conta</Text>
                <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputFocused]}>
                        <TextInput
                            placeholder='Digite seu e-mail'
                            value={email}
                            onChangeText={setEmail}
                            style={styles.inputField}
                            keyboardType="email-address"
                            autoCapitalize='none'
                            autoComplete='email'
                            returnKeyType='next'
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                            // onFocus={() => setFocusedInput('email')}
                            // onBlur={() => setFocusedInput(null)}
                        />
                    </View>

                
                
                <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputFocused]}>
                    <TextInput
                        ref={passwordInputRef}
                        placeholder='Digite sua senha'
                        value={password}
                        onChangeText={setPassword}
                        style={styles.inputField}
                        secureTextEntry={!isPasswordVisible}
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="password"
                        autoComplete='password' 
                        returnKeyType='done'
                        onSubmitEditing={handleSignin}
                        // onFocus={() => setFocusedInput('password')}
                        // onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
                    </TouchableOpacity>
                </View>


            </View>
            </View>
            
            <View style={styles.buttons}>
                 <Pressable onPress={handleSignin} style={styles.loginButton}>
                    <AppText style={styles.loginButtonText}>{loading ? 'Carregando...' : 'Entrar'}</AppText>
                </Pressable>

                <Link style={styles.signUpText} href='/(auth)/signup/page'>
                    <AppText>Ainda não tem uma conta? Se inscreva!</AppText>
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
        paddingBottom: 120,
        // backgroundColor: "blue"
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: 'green',
        width: '70%',
        // paddingHorizontal: 45
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
        fontWeight: '700',
    },
    inputContainer: {
        display: 'flex',
        gap: 15,
        marginTop: 80,
        // backgroundColor: "red",
        maxWidth: 450,
        width: '100%'
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
        fontSize: 18,
        fontWeight: '600'
    },
    buttons: {
        display: 'flex',
        gap: 10,
        width: '70%',
        alignItems: 'center',
        maxWidth: 450
    },
    signUpText: {
        textAlign: 'center'
    },
    inputLoginPassword: {
        borderColor: Colors.light.grey,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 45
    },
    inputPassword: {
        flex: 1,
        color: Colors.light.darkGrey,
        fontSize: 14,
        fontWeight: '500',
    },
    icon: {
        paddingLeft: 10
    },
    inputFocused: {
        borderColor: Colors.light.blue, 
        borderWidth: 2,
        shadowColor: Colors.light.blue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4
    },
    inputField: {
        flex: 1,
        color: Colors.light.darkGrey,
        fontSize: 14,
        fontWeight: '500',
        paddingVertical: 10,
        borderWidth: 0,
    },
    inputWrapper: {
        borderColor: Colors.light.grey,
        borderWidth: 1,
        borderRadius: 20,
        minHeight: 45,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    }
})


