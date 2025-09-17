import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from "@/src/components/AppButton";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { slider } from "@/data/SliderData";
import { SliderItem } from "@/src/components/SliderItem";


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
            <View>
                <FlatList
                    data={slider}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    renderItem={({ item, index}) => <SliderItem item={item} index={index} />}
                />

                <View style={styles.footer}>
                    <AppButton title="Entendi!" onPress={() => router.back()}/>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
    },
    // container: {
    //     flex: 1,
    //     alignItems: 'center'
    // },
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