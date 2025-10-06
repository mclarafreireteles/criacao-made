import { Stack } from 'expo-router';
import { GameFormProvider } from '@/src/contexts/GameFormContext';

export default function EditGameLayout() {
  return (
    // <GameFormProvider>
      <Stack screenOptions={{ headerShown: false }} />
  );
}