import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GLOBAL_FONT } from '../Fonts';

type Props = {
    attempts: number;
    maxAttempts: number;
    score: number;
};

export function GameScoreboard({ attempts, maxAttempts, score }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.infoBox}>
                <Text style={styles.label}>TENTATIVAS</Text>
                <Text style={styles.value}>{attempts} / {maxAttempts}</Text>
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.label}>PONTUAÇÃO</Text>
                <Text style={styles.value}>{score}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 15,
        marginBottom: 20,
        width: '100%',
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        fontFamily: GLOBAL_FONT
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 4,
        fontFamily: GLOBAL_FONT
    },
});