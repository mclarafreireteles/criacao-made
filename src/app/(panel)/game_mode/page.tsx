import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { GLOBAL_FONT } from '@/src/components/Fonts';
import { useGameDatabase } from '@/src/database/useGameDatabase';

export default function GameModeScreen() {
    const router = useRouter();
    const { game_id } = useLocalSearchParams();
    const gameIdNumber = Number(game_id);

    const { getCardsByGameId } = useGameDatabase();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function validateGameRequirements() {
            if (!gameIdNumber) return;

            try {
                const cards = await getCardsByGameId(gameIdNumber);

                const correctCount = cards.filter(c => Number(c.card_type) === 1).length;
                const incorrectCount = cards.filter(c => Number(c.card_type) !== 1).length;

                const MIN_CORRECT = 9;
                const MIN_INCORRECT = 3;

                if (correctCount < MIN_CORRECT || incorrectCount < MIN_INCORRECT) {
                    console.log('jogo incompleto');

                    const title = "Jogo Incompleto";
                    const message = `Para jogar, é necessário ter no mínimo:\n` +
                        `• ${MIN_CORRECT} cartas corretas (Atual: ${correctCount})\n` +
                        `• ${MIN_INCORRECT} cartas incorretas (Atual: ${incorrectCount})\n\n` +
                        `Por favor, edite o jogo e adicione mais cartas.`;

                    if (Platform.OS === 'web') {
                        setTimeout(() => {
                            window.alert(message);
                            router.back();
                        }, 100);
                    } else {
                        Alert.alert(
                            title,
                            message,
                            [
                                { text: "Voltar", onPress: () => router.back() }
                            ]
                        );
                    }
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.log("Erro ao validar jogo:", error);
                setIsLoading(false);
            }
        }
        validateGameRequirements();
    }, [gameIdNumber]);

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
            <ScreenHeader title="Escolha o modo de jogo" />
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
        fontFamily: GLOBAL_FONT
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
        fontFamily: GLOBAL_FONT
    },
    optionDescription: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        fontFamily: GLOBAL_FONT
    }
});