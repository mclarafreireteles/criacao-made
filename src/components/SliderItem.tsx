import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { SliderType } from "@/data/SliderData"
import { Ionicons } from "@expo/vector-icons"
import { useWindowDimensions } from "react-native"

type Props = {
    item: SliderType;
    index: number;
}

export function SliderItem({ item, index }: Props) {
    const { width } = useWindowDimensions();
    return (
        <View style={[styles.stepContainer, { width }]}>
            <Ionicons name={item.icon as any} size={80} color="#4A5568" />
            <Text style={styles.stepTitle}>{item.title}</Text>
            <Text style={styles.stepDescription}>{item.description}</Text>
            {item.details && (
                <View style={styles.detailsContainer}>
                    {item.details.map((item.details) => ( //array
                        <Text key={index} style={styles.detailItem}>• {detail}</Text>
                    ))}
                </View>
            )}
        </View>
    )
}

