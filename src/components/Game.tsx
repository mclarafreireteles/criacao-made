import React from 'react';
import { Pressable, Text, PressableProps, View, StyleSheet, Platform } from "react-native"
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import { GLOBAL_FONT } from './Fonts';

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

export function Game({ data, ...rest }: Props) {
    const router = useRouter()

    const handleEdit = () => {
        router.push({
            pathname: '/game_dashboard/page',
            params: { game_id: data.id }
        })
    }

    const handlePlayGame = (gameId: number) => {
        router.push({
            pathname: '/(panel)/game_mode/page',
            params: { game_id: gameId }
        });
    }

    return (
        <Pressable {...rest} style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.headerFull}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.titleText}>{data.title}</Text>
                        </View>

                    </View>
                    <View style={styles.cardBody}>
                        <View>
                            <Text style={styles.subtitleText}>{data.content}</Text>
                            <Text style={styles.authorsText}>{data.authors}</Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <Pressable
                                style={styles.playButton}
                                onPress={() => handlePlayGame(data.id)}
                            >
                                <Ionicons name="play-circle" size={28} color={Colors.light.blue} />
                            </Pressable>
                            <Pressable onPress={handleEdit} style={styles.editButton}>
                                <MaterialIcons name="edit" size={28} color={Colors.light.blue} />
                            </Pressable>
                        </View>
                    </View>

                </View>


            </View>

            <View style={styles.bottomSection}>
                <Text style={{fontFamily: GLOBAL_FONT}}>{data.subject}</Text>
                <Text style={{fontFamily: GLOBAL_FONT}}>{data.grade}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red', 
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        width: '85%',
        maxWidth: 800,
        alignSelf: 'center',
        marginVertical: 10,
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
        flexDirection: 'row',
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
        backgroundColor: Colors.light.lightGreen,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 600,
        color: '#1E293B',
        marginBottom: 4,
        fontFamily: GLOBAL_FONT
    },
    subtitleText: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 12,
        fontFamily: GLOBAL_FONT
    },
    authorsText: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: GLOBAL_FONT
    },
    editButton: {
        backgroundColor: '#EFF6FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        maxHeight: 40,
        maxWidth: 40,
    },
    editButtonText: {
        color: Colors.light.blue,
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
    playButton: {
        backgroundColor: '#EFF6FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        maxHeight: 40,
        maxWidth: 40,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardBody: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between'
    }
});