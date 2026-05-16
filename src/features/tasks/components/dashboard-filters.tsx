import type { DashboardFilter } from '../types';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

export type { DashboardFilter };

const FILTERS: { key: DashboardFilter; label: string }[] = [
  { key: 'all', label: 'Hamısı' },
  { key: 'pool', label: 'Hovuz' },
  { key: 'mine', label: 'Mənim' },
  { key: 'it', label: 'IT' },
  { key: 'done', label: 'Bitən' },
];

type Props = {
  value: DashboardFilter;
  onChange: (filter: DashboardFilter) => void;
};

export function DashboardFilters({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterRow}
    >
      {FILTERS.map(f => (
        <Pressable
          key={f.key}
          style={[styles.filterChip, value === f.key && styles.filterChipActive]}
          onPress={() => onChange(f.key)}
        >
          <Text style={[styles.filterText, value === f.key && styles.filterTextActive]}>
            {f.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterScroll: { marginTop: 20, marginHorizontal: -16 },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BRAVO_COLORS.surface,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  filterChipActive: {
    backgroundColor: BRAVO_COLORS.primary,
    borderColor: BRAVO_COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAVO_COLORS.textMuted,
  },
  filterTextActive: { color: '#fff' },
});
