import type { TaskPriority } from '../types';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

const PRIORITIES: { key: TaskPriority; label: string; color: string }[] = [
  { key: 'low', label: 'Aşağı', color: '#22C55E' },
  { key: 'medium', label: 'Orta', color: '#EAB308' },
  { key: 'high', label: 'Yüksək', color: '#F97316' },
  { key: 'critical', label: 'Kritik', color: '#EF4444' },
];

const DEADLINE_HOURS = [1, 2, 4, 8, 12, 24];

type Props = {
  priority: TaskPriority;
  deadlineDays: number;
  deadlineHours: number;
  onPriorityChange: (p: TaskPriority) => void;
  onDeadlineChange: (days: number) => void;
  onDeadlineHoursChange: (hours: number) => void;
};

export function CreateTaskOptions({
  priority,
  deadlineDays,
  deadlineHours,
  onPriorityChange,
  onDeadlineChange,
  onDeadlineHoursChange,
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
            <View style={[styles.priorityDot, { backgroundColor: priority === p.key ? '#fff' : p.color }]} />
            <Text style={[styles.priorityText, priority === p.key && styles.priorityTextActive]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.fieldLabel}>Son tarix</Text>
      <View style={styles.deadlineRow}>
        {[0, 1, 2, 3, 7].map(days => (
          <Pressable
            key={days}
            style={[styles.dayChip, deadlineDays === days && styles.dayChipActive]}
            onPress={() => onDeadlineChange(days)}
          >
            <Text style={[styles.dayText, deadlineDays === days && styles.dayTextActive]}>
              {days === 0 ? 'Bugün' : `${days} gün`}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.subLabel}>+ Əlavə saat</Text>
      <View style={styles.deadlineRow}>
        {DEADLINE_HOURS.map(h => (
          <Pressable
            key={h}
            style={[styles.hourChip, deadlineHours === h && styles.dayChipActive]}
            onPress={() => onDeadlineHoursChange(deadlineHours === h ? 0 : h)}
          >
            <Text style={[styles.dayText, deadlineHours === h && styles.dayTextActive]}>
              {`${h} s`}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginBottom: 8 },
  priorityRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: BRAVO_COLORS.surface,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  priorityActive: { backgroundColor: BRAVO_COLORS.primary, borderColor: BRAVO_COLORS.primary },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 12, fontWeight: '600', color: BRAVO_COLORS.text },
  priorityTextActive: { color: '#fff' },
  subLabel: { fontSize: 12, fontWeight: '500', color: BRAVO_COLORS.textMuted, marginBottom: 8, marginTop: -4 },
  deadlineRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  hourChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: BRAVO_COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: BRAVO_COLORS.border },
  dayChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: BRAVO_COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: BRAVO_COLORS.border },
  dayChipActive: { backgroundColor: BRAVO_COLORS.primary, borderColor: BRAVO_COLORS.primary },
  dayText: { fontSize: 13, fontWeight: '600', color: BRAVO_COLORS.textMuted },
  dayTextActive: { color: '#fff' },
});
