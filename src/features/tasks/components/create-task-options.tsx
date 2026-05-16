import type { TaskPriority } from '../types';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

const PRIORITIES: { key: TaskPriority; label: string; points: number }[] = [
  { key: 'low', label: 'Aşağı', points: 15 },
  { key: 'medium', label: 'Orta', points: 25 },
  { key: 'high', label: 'Yüksək', points: 35 },
  { key: 'urgent', label: 'Təcili', points: 50 },
];

type Props = {
  priority: TaskPriority;
  deadlineDays: number;
  onPriorityChange: (p: TaskPriority) => void;
  onDeadlineChange: (days: number) => void;
};

export function CreateTaskOptions({
  priority,
  deadlineDays,
  onPriorityChange,
  onDeadlineChange,
}: Props) {
  return (
    <>
      <Text style={styles.fieldLabel}>Prioritet</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map(p => (
          <Pressable
            key={p.key}
            style={[styles.priorityChip, priority === p.key && styles.priorityActive]}
            onPress={() => onPriorityChange(p.key)}
          >
            <Text style={[styles.priorityText, priority === p.key && styles.priorityTextActive]}>
              {p.label}
            </Text>
            <Text style={[styles.priorityPts, priority === p.key && styles.priorityTextActive]}>
              {`${p.points} xal`}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.fieldLabel}>Son tarix</Text>
      <View style={styles.deadlineRow}>
        {[1, 2, 3, 7].map(days => (
          <Pressable
            key={days}
            style={[styles.dayChip, deadlineDays === days && styles.dayChipActive]}
            onPress={() => onDeadlineChange(days)}
          >
            <Text style={[styles.dayText, deadlineDays === days && styles.dayTextActive]}>
              {`${days} gün`}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    marginBottom: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  priorityChip: {
    width: '47%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: BRAVO_COLORS.surface,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: BRAVO_COLORS.primary,
    borderColor: BRAVO_COLORS.primary,
  },
  priorityText: { fontWeight: '600', color: BRAVO_COLORS.text },
  priorityPts: { fontSize: 11, color: BRAVO_COLORS.textMuted, marginTop: 2 },
  priorityTextActive: { color: '#fff' },
  deadlineRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dayChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: BRAVO_COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  dayChipActive: {
    backgroundColor: BRAVO_COLORS.primary,
    borderColor: BRAVO_COLORS.primary,
  },
  dayText: { fontSize: 13, fontWeight: '600', color: BRAVO_COLORS.textMuted },
  dayTextActive: { color: '#fff' },
});
