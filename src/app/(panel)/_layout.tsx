import { Stack } from 'expo-router';
import { GameFormProvider } from '@/src/contexts/GameFormContext';

export default function PanelLayout() {
  return (
    <GameFormProvider>
      <Stack>
        <Stack.Screen name="home/page" options={{ headerShown: false }} />
        <Stack.Screen name="choose_game/page" options={{ headerShown: false }} />
        <Stack.Screen name="add_game" options={{ headerShown: false }} />
        <Stack.Screen name="manage_cards/page" options={{ headerShown: false }} />
        <Stack.Screen name="manage_cards/add_card" options={{ headerShown: false }} />
        <Stack.Screen name="manage_cards/edit_card" options={{ headerShown: false }} />
        <Stack.Screen name="test_game/page" options={{ headerShown: false }} />
        <Stack.Screen name="how_to_play/page" options={{ headerShown: false }} />
        <Stack.Screen name="game_dashboard/page" options={{ headerShown: false }} />
        <Stack.Screen name="edit_game/page" options={{ headerShown: false }} />
        <Stack.Screen name="game_mode/page" options={{ headerShown: false }} />
        <Stack.Screen name="manual_setup/page" options={{ headerShown: false }} />
      </Stack>
    </GameFormProvider>
  );
} 