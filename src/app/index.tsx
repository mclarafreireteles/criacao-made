import React from 'react';
import { Image, View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router'
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Head from "expo-router/head";
import { GLOBAL_FONT } from "@/src/components/Fonts";

SplashScreen.preventAutoHideAsync();

export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    
    return (
        <>
            <Head>
                <title>Made</title>
            </Head>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('../../assets/images/tecnodocencia.png')}/>
                    <Image source={require('../../assets/images/logo-made.png')} style={styles.logoMade}/>
                </View>
                <View style={styles.options}>
                    <Pressable style={styles.loginButton}>
                        <Link href={'/(auth)/signin/page'} style={styles.link}>
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        </Link>
                    </Pressable>
                    <Pressable style={styles.createButton}>
                        <Link href={'/(auth)/signup/page'} style={styles.link}>
                            <Text style={styles.createButtonText}>Ainda não tenho conta</Text>
                        </Link>
                    </Pressable>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: Colors.light.white,
        paddingVertical: 120
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
    },
    logoMade: {
        width: 300,
        resizeMode: 'contain',
    },
    options: {
        display: 'flex',
        gap: 10,
        width: '70%',
    },
    loginButton: {
        backgroundColor: Colors.light.blue,
        borderRadius: 20,
        color: Colors.light.white,
        paddingHorizontal: 10,
        textAlign: 'center',
        paddingVertical: 8
    },
    createButton: {
        borderColor: Colors.light.blue,
        borderWidth: 1,
        borderRadius: 20,
        color: Colors.light.white,
        paddingHorizontal: 10,
        textAlign: 'center',
        paddingVertical: 8

    },
    loginButtonText: {
        color: Colors.light.white,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: GLOBAL_FONT,
        fontWeight: 700
    },
    createButtonText: {
        color: Colors.light.blue,
        textAlign: 'center',
        fontSize: 18,
        fontFamily: GLOBAL_FONT,
        fontWeight: 700
    },
    link: {
        textAlign: 'center'
    }
})

