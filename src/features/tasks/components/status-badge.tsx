import type { TaskStatus } from '../types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; color: string }
> = {
  pending: { label: 'Gözləyir', bg: '#FEF3C7', color: '#B45309' },
  open_pool: { label: 'Ümumi Hovuz', bg: BRAVO_COLORS.primaryLight, color: BRAVO_COLORS.primary },
  claimed: { label: 'Götürülüb', bg: '#DBEAFE', color: '#1D4ED8' },
  in_progress: { label: 'İşlənir', bg: '#E0E7FF', color: '#4338CA' },
  done: { label: 'Tamamlandı', bg: '#D1FAE5', color: '#047857' },
  cancelled: { label: 'Ləğv', bg: '#FEE2E2', color: '#B91C1C' },
};

type Props = { status: TaskStatus; compact?: boolean };

export function StatusBadge({ status, compact }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        compact && styles.compact,
      ]}
    >
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
