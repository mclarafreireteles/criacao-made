import { Stack } from 'expo-router';
import { GameFormProvider } from '@/src/contexts/GameFormContext';

export default function AddGameLayout() {
  return (
    <GameFormProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameFormProvider>
  );
}