import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { AppButton } from '@/src/components/AppButton';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function GameModeScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const handleRandomMode = () => {
        router.push({
            pathname: '/test_game/select_level',
            params: { 
                game_id: gameIdNumber,
                mode: 'random' 
            }
        });
    };

    const handleManualMode = () => {
        router.push({
            pathname: '/manual_setup/page', 
            params: { game_id: gameIdNumber }
        });
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="Modo de Teste" />
            <View style={styles.container}>
                <Text style={styles.title}>Como você quer testar o jogo?</Text>

                {/* Opção Aleatória */}
                <Pressable style={styles.optionCard} onPress={handleRandomMode}>
                    <Ionicons name="dice-outline" size={48} color={Colors.light.blue} />
                    <Text style={styles.optionTitle}>Modo Aleatório</Text>
                    <Text style={styles.optionDescription}>
                        O computador irá sortear um código secreto aleatório para você testar.
                    </Text>
                </Pressable>

                {/* Opção Manual */}
                <Pressable style={styles.optionCard} onPress={handleManualMode}>
                    <Ionicons name="construct-outline" size={48} color={Colors.light.blue} />
                    <Text style={styles.optionTitle}>Modo Manual</Text>
                    <Text style={styles.optionDescription}>
                        Você irá escolher manualmente a ordem exata das cartas para montar o código secreto deste teste.
                    </Text>
                </Pressable>
            </View>
        </ScreenContainer>
    );
}

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