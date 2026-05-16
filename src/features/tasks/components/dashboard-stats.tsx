import type { BravoUser, TaskItem } from '../types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTaskStore } from '../use-task-store';
import { StatsCard } from './stats-card';

type Props = { user: BravoUser; tasks: TaskItem[] };

export function DashboardStats({ user, tasks }: Props) {
  const leaderboard = useTaskStore.use.leaderboard();
  const weeklyPoints = leaderboard.find(e => e.userId === user.id)?.weeklyPoints ?? 0;

  const myTasks = tasks.filter(
    t => t.assignedToId === user.id || t.createdById === user.id,
  );
  const active = myTasks.filter(
    t => t.status === 'assigned' || t.status === 'in_progress',
  ).length;
  const waitingApproval = myTasks.filter(t => t.status === 'waiting_approval').length;
  const completed = myTasks.filter(t => t.status === 'completed').length;

  return (
    <>
      <View style={styles.row}>
        <StatsCard icon="list" label="Aktiv tapşırıq" value={active} />
        <StatsCard icon="time" label="Təsdiq gözlənir" value={waitingApproval} accent="#3B82F6" />
      </View>
      <View style={styles.row}>
        <StatsCard icon="checkmark-done" label="Tamamlanan" value={completed} accent="#10B981" />
        <StatsCard icon="star" label="Bu həftə xal" value={weeklyPoints} accent="#D4A017" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
});
