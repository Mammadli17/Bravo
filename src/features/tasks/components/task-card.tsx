import type { TaskItem } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getUserById } from '../data/mock-data';
import { formatDeadline, isOverdue } from '../lib/points';
import { getSectionLabel } from '../lib/sections';
import { PriorityDot } from './priority-dot';
import { StatusBadge } from './status-badge';

const PRIORITY_COLORS: Record<string, string> = {
  low: '#22C55E',
  medium: '#EAB308',
  high: '#F97316',
  critical: '#EF4444',
};

type Props = { task: TaskItem };

export function TaskCard({ task }: Props) {
  const router = useRouter();
  const overdue = isOverdue(task);
  const assignee = task.assignedToId ? getUserById(task.assignedToId) : undefined;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/store/task/${task.id}`)}
    >
      <View style={styles.topRow}>
        <View style={styles.leftMeta}>
          <PriorityDot priority={task.priority} />
          <Text style={styles.section}>{getSectionLabel(task.sectionId)}</Text>
        </View>
        <StatusBadge status={task.status} compact />
      </View>

      <Text style={styles.title} numberOfLines={2}>{task.title}</Text>

      <View style={styles.bottomRow}>
        <View style={styles.deadlineRow}>
          <Ionicons name="time-outline" size={13} color={overdue ? BRAVO_COLORS.danger : BRAVO_COLORS.textMuted} />
          <Text style={[styles.deadline, overdue && styles.overdue]}>{formatDeadline(task.deadline)}</Text>
        </View>
        <View style={styles.pointsChip}>
          <Ionicons name="star" size={11} color={BRAVO_COLORS.gold} />
          <Text style={styles.points}>{task.points}</Text>
        </View>
      </View>

      {assignee
        ? (
            <View style={styles.assigneeRow}>
              <View style={[styles.assigneeDot, { backgroundColor: PRIORITY_COLORS[task.priority] ?? BRAVO_COLORS.primary }]} />
              <Text style={styles.assignee}>{assignee.nameAz}</Text>
              <Text style={styles.assigneeRole}>{assignee.roleLabelAz}</Text>
            </View>
          )
        : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: { opacity: 0.93 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  leftMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  section: { fontSize: 12, color: BRAVO_COLORS.textMuted, fontWeight: '500' },
  title: { fontSize: 15, fontWeight: '700', color: BRAVO_COLORS.text, lineHeight: 21, marginBottom: 10 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  deadline: { fontSize: 12, color: BRAVO_COLORS.textMuted },
  overdue: { color: BRAVO_COLORS.danger, fontWeight: '600' },
  pointsChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  points: { fontSize: 12, fontWeight: '700', color: BRAVO_COLORS.gold },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: BRAVO_COLORS.border },
  assigneeDot: { width: 7, height: 7, borderRadius: 3.5 },
  assignee: { fontSize: 12, fontWeight: '600', color: BRAVO_COLORS.text, flex: 1 },
  assigneeRole: { fontSize: 11, color: BRAVO_COLORS.textMuted },
});
