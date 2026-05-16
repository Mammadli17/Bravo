import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BRAVO_COLORS } from '@/features/tasks/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAVO_COLORS.primary,
        tabBarInactiveTintColor: BRAVO_COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: BRAVO_COLORS.surface,
          borderTopColor: BRAVO_COLORS.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tapşırıqlar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Liderlər',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="org-chart"
        options={{
          title: 'Struktur',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="git-branch-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
