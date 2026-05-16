import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BravoHeader } from '../components/bravo-header';
import { StatusBadge } from '../components/status-badge';
import { TaskDetailActions } from '../components/task-detail-actions';
import { TaskDetailInfo } from '../components/task-detail-info';
import { BRAVO_COLORS } from '../constants/theme';
import { calculateEarnedPoints } from '../lib/points';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

export function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const user = useBravoSession.use.user()!;
  const getTaskById = useTaskStore.use.getTaskById();
  const getActivityForTask = useTaskStore.use.getActivityForTask();

  const task = getTaskById(id ?? '');
  const activity = getActivityForTask(id ?? '');

  if (!task) {
    return (
      <View style={styles.container}>
        <BravoHeader title="Tapşırıq" showBack />
        <View style={styles.notFound}>
          <Ionicons name="folder-open-outline" size={48} color={BRAVO_COLORS.textLight} />
          <Text style={styles.notFoundText}>Tapşırıq tapılmadı</Text>
        </View>
      </View>
    );
  }

  const pointsPreview = task.status === 'completed' ? calculateEarnedPoints(task) : null;

  return (
    <View style={styles.container}>
      <BravoHeader title="Tapşırıq Detalları" showBack />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <StatusBadge status={task.status} />
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        <TaskDetailInfo task={task} />

        {pointsPreview
          ? (
              <View style={styles.pointsBox}>
                <Ionicons name="star" size={24} color={BRAVO_COLORS.gold} />
                <Text style={styles.pointsTotal}>{`+${pointsPreview.total} xal`}</Text>
                <Text style={styles.pointsBreak}>
                  {`Əsas: ${pointsPreview.base} · Bonus: ${pointsPreview.bonus} · Cərimə: ${pointsPreview.penalty}`}
                </Text>
              </View>
            )
          : null}

        {task.beforeImageUrl
          ? <PhotoBlock label="Əvvəl (Problem)" uri={task.beforeImageUrl} />
          : null}
        {task.afterImageUrl
          ? <PhotoBlock label="Sonra (Həll)" uri={task.afterImageUrl} note={task.closingNote} />
          : null}

        <TaskDetailActions task={task} user={user} />

        {activity.length > 0
          ? (
              <>
                <Text style={styles.activityTitle}>Fəaliyyət tarixçəsi</Text>
                {activity.map(item => (
                  <View key={item.id} style={styles.activityItem}>
                    <View style={styles.activityDot} />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityAction}>{item.actionAz}</Text>
                      <Text style={styles.activityMeta}>
                        {`${item.userName} · ${new Date(item.timestamp).toLocaleString('az-AZ')}`}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )
          : null}
      </ScrollView>
    </View>
  );
}

function PhotoBlock({ label, uri, note }: { label: string; uri: string; note?: string }) {
  return (
    <View style={styles.photoSection}>
      <Text style={styles.photoLabel}>{label}</Text>
      <View style={styles.photoPlaceholder}>
        <Ionicons name="image-outline" size={32} color={BRAVO_COLORS.textLight} />
        <Text style={styles.photoUri} numberOfLines={1}>{uri}</Text>
      </View>
      {note ? <Text style={styles.closingNote}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  scroll: { padding: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: BRAVO_COLORS.textMuted },
  headerRow: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: BRAVO_COLORS.text, lineHeight: 28, marginBottom: 8 },
  description: { fontSize: 15, color: BRAVO_COLORS.textMuted, lineHeight: 22, marginBottom: 20 },
  pointsBox: { backgroundColor: BRAVO_COLORS.primaryLight, borderRadius: 14, padding: 16, marginBottom: 20, alignItems: 'center', gap: 4 },
  pointsTotal: { fontSize: 32, fontWeight: '800', color: BRAVO_COLORS.primary },
  pointsBreak: { fontSize: 12, color: BRAVO_COLORS.textMuted },
  photoSection: { marginBottom: 20 },
  photoLabel: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginBottom: 8 },
  photoPlaceholder: { height: 80, backgroundColor: BRAVO_COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: BRAVO_COLORS.border, alignItems: 'center', justifyContent: 'center', gap: 4 },
  photoUri: { fontSize: 10, color: BRAVO_COLORS.textLight, maxWidth: '80%' },
  closingNote: { fontSize: 14, color: BRAVO_COLORS.textMuted, marginTop: 8, fontStyle: 'italic', lineHeight: 20 },
  activityTitle: { fontSize: 16, fontWeight: '700', color: BRAVO_COLORS.text, marginBottom: 16 },
  activityItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  activityDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAVO_COLORS.primary, marginTop: 5 },
  activityContent: { flex: 1 },
  activityAction: { fontSize: 14, fontWeight: '500', color: BRAVO_COLORS.text },
  activityMeta: { fontSize: 12, color: BRAVO_COLORS.textMuted, marginTop: 4 },
});
