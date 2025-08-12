import { Stack } from 'expo-router';

export default function PanelLayout() {
  return (
    <Stack>
      <Stack.Screen name="home/page" options={{ headerShown: false }} />
      <Stack.Screen name="choose_game/page" options={{ headerShown: false }} />
      <Stack.Screen name="add_game" options={{ headerShown: false }} />
      <Stack.Screen name="manage_cards/page" options={{ headerShown: false }} />
      <Stack.Screen name="manage_cards/add_card" options={{ headerShown: false }} />
    </Stack>
  );
}