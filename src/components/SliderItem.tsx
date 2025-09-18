import Reactm, { useState } from "react"
import { StyleSheet, View, Text, Dimensions, Pressable, Modal } from "react-native"
import { SliderType } from "@/data/SliderData"
import { Ionicons } from "@expo/vector-icons"
import { useWindowDimensions } from "react-native"
import Colors from "@/constants/Colors"
import { AppButton } from "./AppButton"

type Props = {
    item: SliderType;
    index: number;
}


export function SliderItem({ item, index }: Props) {

    const { width } = useWindowDimensions();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={[styles.stepContainer, {width}]}>
            <Ionicons name={item.icon as any} size={40} color="#4A5568" />
            <Text style={styles.stepTitle}>{item.title}</Text>
            <Text style={styles.stepDescription}>{item.description}</Text>
            {/* {item.details && (
                <View style={styles.detailsContainer}>
                {item.details.map((detail, index) => (
                    <Text key={index} style={styles.detailItem}>• {detail}</Text>
            ))} */}

            {item.details && (
                <Pressable style={styles.detailsLink} onPress={() => setModalVisible(true)}>
                    <Text style={styles.detailsLinkText}>Ver detalhes dos níveis</Text>
                </Pressable>
            )}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Níveis de Dificuldade</Text>
                        {item.details?.map((detail, index) => (
                            <Text key={index} style={styles.detailItem}>• {detail}</Text>
                        ))}
                        <View style={{ marginTop: 20 }}>
                            <AppButton title="Fechar" onPress={() => setModalVisible(false)} />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
)}

const styles = StyleSheet.create({
    stepContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20
    },
    stepTitle: {
        fontSize: 18,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    detailsLink: {
        marginTop: 20,
    },
    detailsLinkText: {
        color: Colors.light.blue,
        fontSize: 16,
        fontWeight: '500',
    },
})

