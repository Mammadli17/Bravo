import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

type NavItem = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  accent?: string;
};

type Props = { items: NavItem[] };

export function DashboardQuickNav({ items }: Props) {
  return (
    <View style={styles.quickNav}>
      {items.map(item => (
        <Pressable key={item.label} style={styles.quickBtn} onPress={item.onPress}>
          <Ionicons name={item.icon} size={22} color={item.accent ?? BRAVO_COLORS.textMuted} />
          <Text style={styles.quickLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  quickNav: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BRAVO_COLORS.textMuted,
  },
});
