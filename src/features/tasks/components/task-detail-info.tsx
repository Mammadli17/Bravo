import type { TaskItem } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getUserById } from '../data/mock-data';
import { formatDeadline, isOverdue } from '../lib/points';
import { getSectionLabel } from '../lib/sections';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Aşağı',
  medium: 'Orta',
  high: 'Yüksək',
  critical: 'Kritik',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#22C55E',
  medium: '#EAB308',
  high: '#F97316',
  critical: '#EF4444',
};

type Props = { task: TaskItem };

export function TaskDetailInfo({ task }: Props) {
  const creator = getUserById(task.createdById);
  const assignee = task.assignedToId ? getUserById(task.assignedToId) : undefined;
  const overdue = isOverdue(task);

  return (
    <View style={styles.grid}>
      <Row icon="calendar-outline" label="Son tarix" value={formatDeadline(task.deadline)} danger={overdue} />
      <Row icon="star-outline" label="Xal" value={`${task.points} xal (+${task.speedBonus} bonus)`} />
      <Row
        icon="grid-outline"
        label="Şöbə"
        value={getSectionLabel(task.sectionId)}
      />
      <Row icon="person-outline" label="Yaradan" value={creator?.nameAz ?? '—'} sub={creator?.roleLabelAz} />
      {assignee
        ? <Row icon="arrow-forward-outline" label="Hazırkı cavabdeh" value={assignee.nameAz} sub={assignee.roleLabelAz} />
        : null}
      <View style={styles.priorityRow}>
        <Ionicons name="flag-outline" size={16} color={BRAVO_COLORS.textMuted} />
        <View>
          <Text style={styles.infoLabel}>Prioritet</Text>
          <View style={styles.priorityChip}>
            <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[task.priority] ?? '#9CA3AF' }]} />
            <Text style={[styles.priorityText, { color: PRIORITY_COLORS[task.priority] ?? BRAVO_COLORS.text }]}>
              {PRIORITY_LABELS[task.priority] ?? task.priority}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  sub,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  sub?: string;
  danger?: boolean;
}) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={16} color={BRAVO_COLORS.textMuted} />
      <View style={styles.infoBody}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, danger && styles.infoDanger]}>{value}</Text>
        {sub ? <Text style={styles.infoSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 8, marginBottom: 20 },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: BRAVO_COLORS.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  infoBody: { flex: 1 },
  infoLabel: { fontSize: 11, color: BRAVO_COLORS.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginTop: 2 },
  infoSub: { fontSize: 11, color: BRAVO_COLORS.textMuted, marginTop: 2 },
  infoDanger: { color: BRAVO_COLORS.danger },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: BRAVO_COLORS.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  priorityChip: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 14, fontWeight: '700' },
});
