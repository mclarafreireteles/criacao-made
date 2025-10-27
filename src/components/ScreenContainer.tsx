import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors'; // Ajuste o caminho se necessário
type Props = {
  children: React.ReactNode; // Qualquer componente React que será renderizado dentro
  style?: ViewStyle;          // Um estilo customizado opcional
};

export function ScreenContainer({ children, style }: Props) {
  return (
    <View style={styles.safeArea}>
      {/* A View interna aplica nosso padding padrão e qualquer estilo customizado que for passado */}
      <View style={[styles.container, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // paddingHorizontal: 20, // Padding lateral padrão para todas as telas
    paddingVertical: 45,   // Padding vertical padrão
  },
});