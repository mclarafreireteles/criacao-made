import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

type StyledInputProps = {
  label: string;
} & TextInputProps;

export function StyledInput({ label, ...textInputProps }: StyledInputProps) {
  return (
    <View style={styles.wrapper}>
      {/* O label acima do campo */}
      <Text style={styles.label}>{label}</Text>

      {/* O container que imita o visual do botão do dropdown */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholderTextColor={Colors.light.grey} // Cor do placeholder
          {...textInputProps} // Passa todas as outras props para o TextInput
        />
      </View>
    </View>
  );
}

// Reutilizamos os mesmos nomes de estilo para manter a consistência
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  // Este estilo é uma cópia do 'dropdownButton' para manter o visual idêntico
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.light.grey,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: '#000',
  },
});