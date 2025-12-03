import React from 'react';
import { Pressable, View, Text, ImageBackground, StyleSheet, ImageSourcePropType, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { GLOBAL_FONT } from '../Fonts';

export const CARD_WIDTH = 100;
export const CARD_ASPECT_RATIO = 0.8;

type Props = {
    text?: string;
    imageSource?: ImageSourcePropType; 
    variant: 'empty' | 'back' | 'front'; 
    isSelected?: boolean; 
    isUsed?: boolean; 
    onPress?: () => void;
    disabled?: boolean;
    style?: ViewStyle;
};

export function PlayingCard({ 
    text, 
    imageSource, 
    variant, 
    isSelected, 
    isUsed, 
    onPress, 
    disabled,
    style 
}: Props) {

    // 1. Variante: Slot Vazio (Tracejado)
    if (variant === 'empty') {
        return (
            <Pressable 
                onPress={onPress} 
                disabled={disabled}
                style={[styles.container, styles.emptyContainer, style]}
            >
                <View /> 
            </Pressable>
        );
    }

    // 2. Variante: Verso da Carta (Imagem de Fundo)
    if (variant === 'back' && imageSource) {
        return (
            <View style={[styles.container, styles.cardContainer, style]}>
                <ImageBackground 
                    source={imageSource} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
            </View>
        );
    }

    // 3. Variante: Frente da Carta (Com Texto)
    return (
        <Pressable 
            onPress={onPress}
            disabled={disabled || isUsed}
            style={[
                styles.container, 
                styles.cardContainer,
                isSelected && styles.selected,
                isUsed && styles.used,
                style
            ]}
        >
            {imageSource && (
                <ImageBackground 
                    source={imageSource} 
                    style={styles.image} 
                    resizeMode="cover"
                >
                    {text && <Text style={styles.text}>{text}</Text>}
                </ImageBackground>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        aspectRatio: CARD_ASPECT_RATIO,
        overflow: 'hidden',
        margin: 4, 
    },
    emptyContainer: {
        backgroundColor: Colors.light.white,
        borderWidth: 2,
        borderColor: '#9CA3AF',
        borderStyle: 'dashed',
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000', 
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        fontFamily: GLOBAL_FONT
    },
    // Estados
    selected: {
        borderWidth: 3,
        borderColor: Colors.light.blue,
        transform: [{ scale: 1.05 }],
    },
    used: {
        opacity: 0.4,
    }
});