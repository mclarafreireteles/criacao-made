import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export function AppText(props: TextProps) {
  return (
    <Text 
      {...props} 
      style={[styles.defaultStyle, props.style]} 
    />
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'Manrope',
    fontSize: 16,
    color: Colors.light.text, 
  },
});