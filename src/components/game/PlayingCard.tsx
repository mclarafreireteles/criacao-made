import { Pressable, View, Text, ImageBackground, StyleSheet, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { GLOBAL_FONT } from '../Fonts';

export const CARD_WIDTH = 100;
export const CARD_ASPECT_RATIO = 0.8;

type Props = {
    text?: string;
    contentImageUri?: string;
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
    contentImageUri,
    imageSource,
    variant,
    isSelected,
    isUsed,
    onPress,
    disabled,
    style
}: Props) {

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
                    <View style={styles.innerContent}>
                        {/* 1. SE TIVER IMAGEM, MOSTRA A IMAGEM */}
                        {contentImageUri ? (
                            <Image
                                source={{ uri: contentImageUri }}
                                style={[
                                    styles.contentImage,
                                    // Se tiver texto também, diminui um pouco a imagem para caber tudo
                                    text ? { height: '60%' } : { height: '85%' }
                                ]}
                                resizeMode="contain"
                            />
                        ) : null}

                        {/* 2. SE TIVER TEXTO, MOSTRA O TEXTO */}
                        {text ? (
                            <Text
                                style={[
                                    styles.cardText,
                                    contentImageUri && { fontSize: 14, marginTop: 2 }
                                ]}
                                numberOfLines={3}
                            >
                                {text}
                            </Text>
                        ) : null}
                    </View>
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
    cardText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        fontFamily: GLOBAL_FONT,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    contentImage: {
        width: '100%',
        borderRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        fontFamily: GLOBAL_FONT
    },
    innerContent: {
        width: '85%',
        height: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
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