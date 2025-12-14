import React, { useRef, useState } from "react";
import { View, StyleSheet, FlatList,Platform } from 'react-native'
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { AppButton } from "@/src/components/AppButton";
import { useRouter } from "expo-router";
import { slider } from "@/data/SliderData";
import { SliderItem } from "@/src/components/SliderItem";
import { ScreenContainer } from "@/src/components/ScreenContainer";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SharedValue } from 'react-native-reanimated';


type PaginationDotProps = {
    index: number;
    activeIndex: SharedValue<number>;
};

function PaginationDot({ index, activeIndex }: PaginationDotProps) {
    const animatedDotStyle = useAnimatedStyle(() => {
        const isActive = activeIndex.value === index;
        return {
            backgroundColor: withTiming(isActive ? '#4A5568' : '#CBD5E0', { duration: 300 }),
            width: withTiming(isActive ? 12 : 8, { duration: 300 }),
            height: withTiming(isActive ? 12 : 8, { duration: 300 }),
        };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
}


export default function HowToPlay(){
    const router = useRouter();

    const activeIndex = useSharedValue(0);


    const [currentIndex, setCurrentIndex] = useState(0);

    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            activeIndex.value = newIndex;
            setCurrentIndex(newIndex);
        }
    }).current;

    return (
        <ScreenContainer>
            <ScreenHeader title="Como Jogar" />
            <View style={styles.container}>
                <FlatList
                    data={slider}
                    horizontal
                    showsHorizontalScrollIndicator={Platform.OS === 'web'}
                    pagingEnabled
                    renderItem={({ item, index}) => <SliderItem item={item} index={index} />}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                />

                {Platform.OS !== 'web' && (
                    <View style={styles.pagination}>
                        {slider.map((_, index) => (
                            <PaginationDot
                                key={index}
                                index={index}
                                activeIndex={activeIndex}
                            />
                        ))}
                    </View>
                )}

                <View style={styles.footer}>
                    <AppButton title="Entendi!" onPress={() => router.back()}/>
                </View>
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    footer: {
        width: '100%',
        padding: 20,
    }
})