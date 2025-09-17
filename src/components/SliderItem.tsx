import React from "react"
import { StyleSheet, View, Text, Dimensions } from "react-native"
import { SliderType } from "@/data/SliderData"
import { Ionicons } from "@expo/vector-icons"
import { useWindowDimensions } from "react-native"
import Colors from "@/constants/Colors"

type Props = {
    item: SliderType;
    index: number;
}


export function SliderItem({ item, index }: Props) {

    const { width } = useWindowDimensions();

    return (
        <View style={[styles.stepContainer, {width}]}>
            <Ionicons name={item.icon as any} size={80} color="#4A5568" />
            <Text style={styles.stepTitle}>{item.title}</Text>
            <Text style={styles.stepDescription}>{item.description}</Text>
            {/* {item.details && (
                <View style={styles.detailsContainer}>
                    {item.details.map((item.details) => ( //array
                        <Text key={index} style={styles.detailItem}>• {details}</Text>
                    ))}
                </View>
            )} */}
        </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
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

