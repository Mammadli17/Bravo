import type { TaskItem } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getUserById } from '../data/mock-data';
import { formatDeadline, isOverdue } from '../lib/points';

type Props = { task: TaskItem };

export function TaskDetailInfo({ task }: Props) {
  const creator = getUserById(task.createdById);
  const assignee = task.assignedToId ? getUserById(task.assignedToId) : undefined;
  const claimer = task.claimedById ? getUserById(task.claimedById) : undefined;
  const overdue = isOverdue(task);

  return (
    <View style={styles.infoGrid}>
      <Row icon="calendar-outline" label="Son tarix" value={formatDeadline(task.deadline)} danger={overdue} />
      <Row icon="star" label="Xal" value={`${task.points} + ${task.speedBonus} bonus`} />
      <Row icon="location-outline" label="Yer" value={task.location ?? '—'} />
      <Row icon="person-outline" label="Yaradan" value={creator?.nameAz ?? '—'} />
      {assignee ? <Row icon="arrow-forward" label="Təyin" value={assignee.nameAz} /> : null}
      {claimer ? <Row icon="hand-left" label="Götürən" value={claimer.nameAz} /> : null}
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={16} color={BRAVO_COLORS.textMuted} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, danger && styles.infoDanger]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoGrid: { gap: 12, marginBottom: 20 },
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
  infoLabel: { fontSize: 11, color: BRAVO_COLORS.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginTop: 2 },
  infoDanger: { color: BRAVO_COLORS.danger },
});
