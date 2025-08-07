// src/components/StyledInput.tsx
import React, { useState, forwardRef } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

// Nossas props customizadas + todas as props padrão de um TextInput
type StyledInputProps = TextInputProps & {
  rightIcon?: React.ReactNode;
};

export const LoginInput = forwardRef<TextInput, StyledInputProps>(
  ({ rightIcon, onFocus, onBlur, ...restProps }, ref) => {
    
    // O estado de foco agora é local, pertence SÓ a este componente.
    const [isFocused, setIsFocused] = useState(false);

    // Funções que atualizam o estado local e também chamam as do componente pai (se existirem)
    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      // O estilo do container muda com base no estado local 'isFocused'
      <View style={[styles.inputWrapper, isFocused && styles.inputFocused]}>
        <TextInput
          ref={ref} // Encaminhando a ref para o TextInput real
          style={styles.inputField}
          placeholderTextColor={Colors.light.grey}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps} // Passa o resto das props (value, onChangeText, etc.)
        />
        {/* Renderiza um ícone à direita, se for passado */}
        {rightIcon}
      </View>
    );
  }
);

// Estilos que antes estavam na tela de Login, agora estão encapsulados aqui.
const styles = StyleSheet.create({
  inputWrapper: {
    borderColor: Colors.light.grey,
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  inputFocused: {
    borderColor: Colors.light.blue,
    borderWidth: 2,
    shadowColor: Colors.light.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  inputField: {
    flex: 1,
    color: Colors.light.darkGrey,
    fontSize: 16,
    fontWeight: '500',
  },
});