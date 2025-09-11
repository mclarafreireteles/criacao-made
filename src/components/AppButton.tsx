import React from 'react';
import { Text, StyleSheet, Pressable, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

type Props = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
  icon?: keyof typeof Ionicons.glyphMap; 
};

export function AppButton({ title, variant = 'primary', icon, ...pressableProps }: Props) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressableProps.disabled && styles.disabledButton, 
        pressed && styles.pressed,
      ]}
      {...pressableProps}
    >
      {/* Renderiza o ícone apenas se um for passado */}
      {icon && <Ionicons name={icon} size={20} color={isPrimary ? '#fff' : Colors.light.blue} />}
      
      {/* O texto do botão */}
      <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: Colors.light.blue,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: Colors.light.blue,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: Colors.light.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5, 
  },
  pressed: {
      opacity: 0.8,
  }
});