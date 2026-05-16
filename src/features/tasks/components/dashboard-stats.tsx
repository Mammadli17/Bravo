import type { BravoUser, TaskItem } from '../types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTaskStore } from '../use-task-store';
import { StatsCard } from './stats-card';

type Props = { user: BravoUser; tasks: TaskItem[]; isManager: boolean };

export function DashboardStats({ user, tasks, isManager }: Props) {
  const leaderboard = useTaskStore.use.leaderboard();
  const weeklyPoints
    = leaderboard.find(e => e.userId === user.id)?.weeklyPoints ?? 0;

  const storeTasks = tasks.filter(
    t => t.storeId === user.storeId || t.assignedToId === user.id,
  );
  const active = storeTasks.filter(
    t => t.status !== 'done' && t.status !== 'cancelled',
  ).length;
  const pool = storeTasks.filter(t => t.status === 'open_pool').length;
  const done = storeTasks.filter(t => t.status === 'done').length;
  const myActive = storeTasks.filter(
    t =>
      (t.claimedById === user.id || t.assignedToId === user.id)
      && t.status !== 'done',
  ).length;

  return (
    <>
      <View style={styles.statsRow}>
        <StatsCard
          icon="list"
          label="Aktiv tapşırıq"
          value={isManager ? active : myActive}
        />
        <StatsCard icon="water" label="Ümumi hovuz" value={pool} accent="#3B82F6" />
      </View>
      <View style={styles.statsRow}>
        <StatsCard icon="checkmark-done" label="Tamamlanan" value={done} accent="#10B981" />
        <StatsCard icon="star" label="Bu həftə xal" value={weeklyPoints} accent="#D4A017" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
});
