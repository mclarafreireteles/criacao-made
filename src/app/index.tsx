import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Link } from 'expo-router'
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function Index() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <View>
            <ActivityIndicator size={44}/>
        </View>
    )
}

