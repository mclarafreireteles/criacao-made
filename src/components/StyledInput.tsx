import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';
import { GLOBAL_FONT } from './Fonts';

type StyledInputProps = {
  label: string;
} & TextInputProps;

export function StyledInput({ label, multiline, style, ...textInputProps }: StyledInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineInput,
            style
          ]}
          placeholderTextColor={Colors.light.grey}
          multiline={multiline} 
          {...textInputProps}
        />
      </View>
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
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.light.grey,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    minHeight: 50, 
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    fontFamily: GLOBAL_FONT
  },
  multilineContainer: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
});