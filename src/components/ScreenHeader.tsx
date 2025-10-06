import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { BackButtonIcon } from './icons/BackButtonIcon';
import { Href } from 'expo-router';

type Props = {
  title: string;
  rightAccessory?: React.ReactNode;
  backHref?: Href;
};

export function ScreenHeader({ title, rightAccessory, backHref }: Props) {
  const router = useRouter();

  const handleBackPress = () => {
    if (backHref) {
      router.replace(backHref)
    } else {
      router.back();
    }
  }

  return (
    <View style={styles.container}>
        {router.canGoBack() && (
        <BackButtonIcon
            style={styles.leftAction}
            onPress={handleBackPress}
        />
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightAccessory && (
        <View style={styles.rightAction}>
          {rightAccessory}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20, 
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: Colors.light.text,
  },
  leftAction: {
    position: 'absolute',
    left: 50, 
  },
  rightAction: {
    position: 'absolute',
    right: 50, 
  },
});