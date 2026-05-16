import type { TaskItem } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getUserById } from '../data/mock-data';
import { formatDeadline, isOverdue } from '../lib/points';
import { PriorityDot } from './priority-dot';
import { StatusBadge } from './status-badge';

type Props = {
  task: TaskItem;
  showAssignee?: boolean;
};

export function TaskCard({ task, showAssignee = true }: Props) {
  const router = useRouter();
  const overdue = isOverdue(task);
  const assignee = task.assignedToId
    ? getUserById(task.assignedToId)
    : task.claimedById
      ? getUserById(task.claimedById)
      : undefined;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/store/task/${task.id}`)}
    >
      <View style={styles.topRow}>
        <View style={styles.typeRow}>
          <PriorityDot priority={task.priority} />
          <Text style={styles.category}>{task.categoryAz}</Text>
          {task.type === 'it_ticket'
            ? (
                <View style={styles.itTag}>
                  <Ionicons name="hardware-chip" size={12} color="#4338CA" />
                  <Text style={styles.itText}>IT</Text>
                </View>
              )
            : null}
        </View>
        <StatusBadge status={task.status} compact />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons
          name="time-outline"
          size={14}
          color={overdue ? BRAVO_COLORS.danger : BRAVO_COLORS.textMuted}
        />
        <Text
          style={[styles.deadline, overdue && styles.overdue]}
        >
          {formatDeadline(task.deadline)}
        </Text>
        <View style={styles.pointsChip}>
          <Ionicons name="star" size={12} color={BRAVO_COLORS.gold} />
          <Text style={styles.points}>{task.points}</Text>
        </View>
      </View>

      {showAssignee && assignee
        ? (
            <Text style={styles.assignee}>
              {assignee.nameAz}
            </Text>
          )
        : null}

      {task.beforeImageUrl
        ? (
            <Image
              source={{ uri: task.beforeImageUrl }}
              style={styles.thumb}
              contentFit="cover"
            />
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  category: {
    fontSize: 12,
    color: BRAVO_COLORS.textMuted,
    fontWeight: '500',
  },
  itTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itText: { fontSize: 10, fontWeight: '700', color: '#4338CA' },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadline: { fontSize: 13, color: BRAVO_COLORS.textMuted, flex: 1 },
  overdue: { color: BRAVO_COLORS.danger, fontWeight: '600' },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  points: { fontSize: 12, fontWeight: '700', color: BRAVO_COLORS.gold },
  assignee: {
    fontSize: 12,
    color: BRAVO_COLORS.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  thumb: {
    height: 72,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: BRAVO_COLORS.background,
  },
});
