import React from 'react';
import { Pressable, Text, PressableProps, View, StyleSheet, Platform  } from "react-native"
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GameDatabase } from '../database/useGameDatabase';
import Colors from '@/constants/Colors';

type Props = PressableProps & {
    data: {
        id: number,
        user_id: string, 
        title: string, 
        subject: string, 
        content: string,
        grade: string,
        authors: string,
        rules: string,
        goal: string, 
        background_image_url: string,
        prompt: string, 
        explanation: string,
        model: string
    }
}

export function Game({data, ...rest}: Props){
    const router = useRouter()

    const handleEdit = () => {
        router.push({
            pathname: '/manage_cards/page',
            params: { game_id: data.id }
        })
    }

    return (
        <Pressable {...rest} style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.headerFull}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.titleText}>{data.title}</Text>
                        </View>
                        <Pressable onPress={handleEdit} style={styles.editButton}>
                            <Ionicons name="pencil" size={20} color={Colors.light.blue} />
                        </Pressable>
                    </View>
                    <Text style={styles.subtitleText}>{data.content}</Text>
                    <Text style={styles.authorsText}>{data.authors}</Text>
                </View>

               
            </View>

            <View style={styles.bottomSection}>
                <Text>{data.subject}</Text>
                <Text>{data.grade}</Text>
            </View>
        </Pressable>
    )
}


// 4. StyleSheet completo com todos os estilos necessários
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 10,
    // Sombra (efeito de elevação)
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        },
        android: {
            elevation: 5,
        },
    }),
  },
  header: {
    flexDirection: 'row', // Alinha os itens lado a lado
    justifyContent: 'space-between',
    width: '100%'
  },
  headerFull: {
    width: '100%'
  },
  topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        width: '100%',
        padding: 20
    },
    bottomSection: {
        backgroundColor: Colors.light.lightGreen, // Um tom de roxo
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 16, // Arredonda os cantos inferiores
        borderBottomRightRadius: 16,
        flexDirection: 'row', // Alinha os itens lado a lado
        justifyContent: 'space-between', // Empurra cada item para uma ponta
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 600,
        color: '#1E293B', // Um preto mais suave
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 16,
        color: '#475569', // Cinza escuro
        marginBottom: 12,
    },
    authorsText: {
        fontSize: 14,
        color: '#94A3B8', // Cinza mais claro
    },
    editButton: {
        backgroundColor: '#EFF6FF', // Azul bem claro
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center', // Alinha o ícone e o texto no centro
        padding: 8
    },
    editButtonText: {
        color: Colors.light.blue,
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
});