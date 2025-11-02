import { GameHistoryProvider } from '@/src/contexts/GameHistoryContext';
import { Stack } from 'expo-router';

export default function TestGameLayout() {
  return (
    <GameHistoryProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameHistoryProvider>
  );
}