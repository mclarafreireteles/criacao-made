import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { BackButtonIcon } from './icons/BackButtonIcon';
import { Href } from 'expo-router';

const DEFAULT_RIGHT_LOGO = require('@/assets/images/logo-made-simples.png');

type Props = {
  title?: string;
  logoSource?: any;
  rightAccessory?: React.ReactNode;
  backHref?: Href;
};

export function ScreenHeader({ title, rightAccessory, backHref, logoSource }: Props) {
  const router = useRouter();

  let centerContent = null;

  if (logoSource) {
    centerContent = (
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
      />
    );
  } else if (title) {
    centerContent = (
      <Text style={styles.title}>{title}</Text>
    );
  }

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

      {centerContent}

      <View style={styles.rightAction}>
        {rightAccessory ? (
          rightAccessory
        ) : (
          <Image
            source={DEFAULT_RIGHT_LOGO}
            style={styles.rightLogoImage}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  logo: {
    height: 40,
    width: 120,
  },
  rightLogoImage: {
    height: 40,
  }
});