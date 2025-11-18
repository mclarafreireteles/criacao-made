import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // <-- Importe o Ionicons

// Configuração dos Níveis (agora com ícones e descrições)
const levels = [
    { 
        id: 1, 
        name: 'Nível 1', 
        attempts: 10, 
        icon: 'analytics-outline', // Ícone para Nível 1
        description: 'Um começo tranquilo com 10 tentativas.' 
    },
    { 
        id: 2, 
        name: 'Nível 2', 
        attempts: 8, 
        icon: 'bar-chart-outline', // Ícone para Nível 2
        description: 'Um desafio balanceado com 8 tentativas.' 
    },
    { 
        id: 3, 
        name: 'Nível 3', 
        attempts: 6, 
        icon: 'speedometer-outline', // Ícone para Nível 3
        description: 'As coisas ficam difíceis com 6 tentativas.' 
    },
    { 
        id: 4, 
        name: 'Nível 4', 
        attempts: 5, 
        icon: 'flame-outline', // Ícone para Nível 4
        description: 'O desafio máximo com apenas 5 tentativas.' 
    },
];

export default function SelectLevelScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const handleSelectLevel = (level: number) => {
        router.push({
            pathname: '/test_game/page', 
            params: {
                ...params,
                level: level,
            }
        });
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Escolha o Nível" />
            <View style={styles.container}>
                <Text style={styles.title}>Selecione a dificuldade:</Text>
                
                {/* Loop atualizado para usar os 'optionCard' */}
                {levels.map((level) => (
                    <Pressable 
                        key={level.id} 
                        style={styles.optionCard} 
                        onPress={() => handleSelectLevel(level.id)}
                    >
                        {/* <Ionicons 
                            // O 'as any' é necessário por causa da tipagem estrita do Ionicons
                            name={level.icon as any} 
                            size={48} 
                            color={Colors.light.blue} 
                        /> */}
                        <Text style={styles.optionTitle}>{`${level.name} (${level.attempts} tentativas)`}</Text>
                        <Text style={styles.optionDescription}>
                            {level.description}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </ScreenContainer>
    );
}

// ESTILOS (Copiados diretamente do GameModeScreen.tsx)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingBottom: 50,
        paddingHorizontal: 45,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionCard: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 25,
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
    },
    optionDescription: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    }
});