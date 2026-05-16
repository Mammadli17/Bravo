import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export default function StoreLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#F5F7FA' },
      }}
    >
      <Stack.Screen name="login" options={{ animation: 'none' }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="leaderboard" />
      <Stack.Screen name="org-chart" />
      <Stack.Screen name="task/[id]" />
    </Stack>
  );
}
