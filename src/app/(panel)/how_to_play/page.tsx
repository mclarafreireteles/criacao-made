import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from "@/src/components/AppButton";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";



export default function HowToPlay(){
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);

    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader title="Como Jogar" />
            <View style={styles.container}>
                <FlatList
                    data={tutorialSteps}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index}) => <SliderItem item={item} index={index} />}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                />

                <View style={styles.pagination}>
                    {tutorialSteps.map((_, index) => (
                        <View key={index} style={[styles.dot, index === currentIndex && styles.dotActive]}/>
                    ))}
                </View>

                <View style={styles.footer}>
                    <AppButton title="Entendi!" onPress={() => router.back()}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.white
    },
    container: {
        flex: 1,
        alignItems: 'center'
    },
    stepContainer: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'red'
    },
    stepTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 16,
        textAlign: 'center',
        color: '#2D3748',
    },
    stepDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: '#718096',
        lineHeight: 24,
    },
    detailsContainer: {
        marginTop: 20,
        alignItems: 'flex-start',
    },
    detailItem: {
        fontSize: 15,
        color: '#4A5568',
        lineHeight: 22,
        marginBottom: 5,
    },
    pagination: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E0',
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#4A5568',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    footer: {
        width: '100%',
        padding: 20,
    }
})