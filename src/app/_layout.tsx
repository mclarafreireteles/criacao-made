import { Stack, router } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '../database/initializeDatabase';

export default function RootLayout(){
    return(
        <AuthProvider>
            <SQLiteProvider databaseName='sqlite.db' onInit={initializeDatabase} options={{ useNewConnection: false }}>
                <MainLayout/>
            </SQLiteProvider>
        </AuthProvider>
    )  
}

function MainLayout(){

    const { setAuth } = useAuth()
    console.log('pagina inicial')

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('session', session?.user)


            if (session) {
                console.log('AUTH STATE CHANGED - User ID:', session?.user?.id);
                setAuth(session.user)
                router.replace('/(panel)/home/page')
                return;
            }

            setAuth(null)
            router.replace('/')
        })
    }, [])

    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{ headerShown: false }}
            />
            {/* <Stack.Screen
                name='(auth)/signup/page'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='(auth)/signin/page'
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name='(panel)'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='(auth)'
                options={{ headerShown: false }}
            />
        </Stack>
    )
}