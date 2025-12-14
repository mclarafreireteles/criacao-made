import { cardFronts } from "@/constants/cardFronts";
import { useGameHistory } from "@/src/contexts/GameHistoryContext";
import { useLocalSearchParams } from "expo-router";
import { GameDatabase, useGameDatabase } from "@/src/database/useGameDatabase";
import { useEffect, useState } from "react";
import { FeedbackHistoryItem } from "@/src/contexts/GameHistoryContext";
import { View, Text, StyleSheet, FlatList, ImageSourcePropType } from "react-native";
import { ScreenContainer } from "@/src/components/ScreenContainer";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { PlayingCard } from "@/src/components/game/PlayingCard";

import { GLOBAL_FONT } from "@/src/components/Fonts";


export default function HistoryScreen() {
    const [gameDetails, setGameDetails] = useState<GameDatabase | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { history } = useGameHistory();
    const database = useGameDatabase();
    const { id } = useLocalSearchParams();
    const selectedCardFront = cardFronts.find(front => front.id === gameDetails?.card_front_url)?.image;

    useEffect(() => {
        async function fetchGameData() {
            console.log('buscando informacoes')
            if (id) {
                try {
                    const data = await database.getGameById(Number(id));
                    setGameDetails(data);
                } catch (err) {
                    console.log("Erro ao buscar jogo")
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log("CANCELADO: ID não encontrado ou inválido");
                setIsLoading(false);
                return;
            }
        }
        fetchGameData();
    }, [id])

    const renderHistoryItem = ({ item }: { item: FeedbackHistoryItem }) => (
        <View style={styles.historyItem}>
            <Text style={styles.historyAttemptTitle}>Tentativa {item.attemptNumber}</Text>

            <View style={styles.historyGuessContainer}>
                {item.guess.map((card, index) => (
                    <PlayingCard
                        key={index}
                        variant={card ? 'front' : 'empty'}
                        text={card?.card_text}
                        imageSource={selectedCardFront as ImageSourcePropType}
                        disabled={true} 
                        contentImageUri={card?.image_uri}
                    />
                ))}
            </View>

            <View style={styles.feedbackContainer}>
                <View style={[styles.feedbackBox, styles.feedbackIncorrect]}>
                    <Text style={styles.feedbackNumber}>{item.feedback.correctCardWrongPosition}</Text>
                    <Text style={styles.feedbackText}>
                        {item.feedback.correctCardWrongPosition === 1
                            ? 'Carta correta na posição errada'
                            : 'Cartas corretas na posição errada'}
                    </Text>
                </View>
                <View style={[styles.feedbackBox, styles.feedbackCorrect]}>
                    <Text style={styles.feedbackNumber}>{item.feedback.correctPosition}</Text>
                    <Text style={styles.feedbackText}>
                        {item.feedback.correctPosition === 1
                            ? 'Carta correta na posição correta'
                            : 'Cartas corretas na posição correta'}
                    </Text>
                </View>
            </View>
        </View>
    )

    return (
        <ScreenContainer>
            <ScreenHeader title="Histórico de Tentativas" />
            <FlatList
                data={history}
                keyExtractor={(item) => item.attemptNumber.toString()}
                renderItem={renderHistoryItem}
                ListEmptyComponent={
                    <Text style={styles.historyEmptyText}>Nenhuma tentativa registrada ainda.</Text>
                }
                contentContainerStyle={styles.listContainer}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    historyItem: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        gap: 24
    },
    historyAttemptTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        fontFamily: GLOBAL_FONT
    },
    historyGuessContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 10,
    },
    historyEmptyText: {
        padding: 20,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontFamily: GLOBAL_FONT
    },
    feedbackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        width: '100%'
    },
    feedbackBox: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    feedbackIncorrect: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5'
    },
    feedbackCorrect: {
        backgroundColor: '#D1FAE5',
        borderColor: '#6EE7B7'
    },
    feedbackNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: GLOBAL_FONT
    },
    feedbackText: {
        textAlign: 'center',
        marginTop: 4,
        fontSize: 14,
        color: '#4B5563',
        fontFamily: GLOBAL_FONT
    },
})