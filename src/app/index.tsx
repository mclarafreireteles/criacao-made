import { Image, View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Link } from 'expo-router'
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function Index() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/images/tecnodocencia.png')}/>
                <Image source={require('../../assets/images/logo-made.png')} style={styles.logoMade}/>
            </View>
            <View style={styles.options}>
                <Pressable style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </Pressable>
                <Pressable style={styles.createButton}>
                    <Text style={styles.createButtonText}>Ainda não tenho conta</Text>
                </Pressable>
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
        paddingVertical: 120
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
    },
    logoMade: {
        width: 300,  // Defina a largura
        resizeMode: 'contain', // Garante que a imagem se ajuste dentro das dimensões
    },
    options: {
        display: 'flex',
        gap: 10,
        width: '60%',
    },
    loginButton: {
        backgroundColor: Colors.light.blue,
        borderRadius: 10,
        color: Colors.light.white,
        paddingHorizontal: 8,
        textAlign: 'center',
        paddingVertical: 6
    },
    createButton: {
        borderColor: Colors.light.blue,
        borderWidth: 1,
        borderRadius: 10,
        color: Colors.light.white,
        paddingHorizontal: 8,
        textAlign: 'center',
        paddingVertical: 6

    },
    loginButtonText: {
        color: Colors.light.white,
        textAlign: 'center',
        fontSize: 20
    },
    createButtonText: {
        color: Colors.light.blue,
        textAlign: 'center',
        fontSize: 20
    },
})

