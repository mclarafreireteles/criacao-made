import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { GLOBAL_FONT } from './Fonts';


type Option = {
  id: string;
  label: string;
};

type OptionSelectorProps = {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (id: string) => void;
  placeholder?: string;
};

export function OptionSelector({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "Selecione..." 
}: OptionSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOptionLabel = options.find(option => option.id === selectedValue)?.label;

  const handleSelect = (id: string) => {
    onSelect(id); 
    setModalVisible(false); 
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={selectedOptionLabel ? styles.dropdownButtonText : styles.placeholderText}>
          {selectedOptionLabel || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.light.grey} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.modalOption} onPress={() => handleSelect(item.id)}>
                  <Text style={styles.modalOptionText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
    fontFamily: GLOBAL_FONT
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.grey,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: GLOBAL_FONT
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.light.grey,
    fontFamily: GLOBAL_FONT
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.grey,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: GLOBAL_FONT 
  },
});