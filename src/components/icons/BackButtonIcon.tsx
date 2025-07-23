import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Colors from '@/constants/Colors';

const backIconSvg = `
<svg viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_120_202" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="35" height="35">
        <rect width="35" height="35" fill="#082de6ff"/>
    </mask>
    <g mask="url(#mask0_120_202)">
        <path d="M17.5 24.5L19.95 22.05L17.15 19.25H24.5V15.75H17.15L19.95 12.95L17.5 10.5L10.5 17.5L17.5 24.5ZM17.5 35C15.0792 35 12.8042 34.5406 10.675 33.6219C8.54583 32.7031 6.69375 31.4563 5.11875 29.8813C3.54375 28.3063 2.29688 26.4542 1.37813 24.325C0.459375 22.1958 0 19.9208 0 17.5C0 15.0792 0.459375 12.8042 1.37813 10.675C2.29688 8.54583 3.54375 6.69375 5.11875 5.11875C6.69375 3.54375 8.54583 2.29688 10.675 1.37813C12.8042 0.459375 15.0792 0 17.5 0C19.9208 0 22.1958 0.459375 24.325 1.37813C26.4542 2.29688 28.3063 3.54375 29.8813 5.11875C31.4563 6.69375 32.7031 8.54583 33.6219 10.675C34.5406 12.8042 35 15.0792 35 17.5C35 19.9208 34.5406 22.1958 33.6219 24.325C32.7031 26.4542 31.4563 28.3063 29.8813 29.8813C28.3063 31.4563 26.4542 32.7031 24.325 33.6219C22.1958 34.5406 19.9208 35 17.5 35Z" fill="#2352FF"/>
    </g>
</svg>

`;

interface BackButtonIconProps {
  onPress: () => void;
  style?: object;
}

export function BackButtonIcon({ onPress, style }: BackButtonIconProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <SvgXml xml={backIconSvg} width="100%" height="100%" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32, // Tamanho da área de toque
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});