import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

type Props = {
  title: string;
  rightAccessory?: React.ReactNode;
};

export function ScreenHeader({ title, rightAccessory }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.sideContainer}>
        {router.canGoBack() && (
          <Pressable onPress={() => router.back()} hitSlop={20}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </Pressable>
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      {/* Acessório da Direita (logo, etc.) */}
      <View style={styles.sideContainer}>{rightAccessory}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: 20,
  },
  sideContainer: {
    width: 50,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});