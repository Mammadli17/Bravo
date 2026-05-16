import type { TaskStatus } from '../types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; color: string }> = {
  assigned: { label: 'Təyin edildi', bg: '#FEF3C7', color: '#B45309' },
  in_progress: { label: 'İcrada', bg: '#E0E7FF', color: '#4338CA' },
  waiting_approval: { label: 'Təsdiq gözlənir', bg: '#DBEAFE', color: '#1D4ED8' },
  completed: { label: 'Tamamlandı', bg: '#D1FAE5', color: '#047857' },
  rejected: { label: 'Rədd edildi', bg: '#FEE2E2', color: '#B91C1C' },
  rework_requested: { label: 'Yenidən işlənsin', bg: '#FFF7ED', color: '#C2410C' },
  overdue: { label: 'Gecikib', bg: '#FEE2E2', color: '#991B1B' },
  cancelled: { label: 'Ləğv', bg: '#F3F4F6', color: '#6B7280' },
};

type Props = { status: TaskStatus; compact?: boolean };

export function StatusBadge({ status, compact }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.assigned;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, compact && styles.compact]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  compact: { paddingHorizontal: 8, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '600' },
});
