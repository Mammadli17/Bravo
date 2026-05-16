import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BravoHeader } from '../components/bravo-header';
import { DashboardQuickNav } from '../components/dashboard-quick-nav';
import { DashboardStats } from '../components/dashboard-stats';
import { TaskCard } from '../components/task-card';
import { BRAVO_COLORS } from '../constants/theme';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

type Tab = 'mine' | 'given' | 'approval';

const ROLE_DEFAULT_TAB: Record<string, Tab> = {
  area_manager: 'given',
  store_manager: 'given',
  store_manager_assistant: 'given',
  section_leader: 'mine',
  senior_seller: 'mine',
  seller: 'mine',
};

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useBravoSession.use.user()!;
  const logout = useBravoSession.use.logout();
  const tasks = useTaskStore.use.tasks();
  const [tab, setTab] = React.useState<Tab>(ROLE_DEFAULT_TAB[user.role] ?? 'mine');
  const [refreshing, setRefreshing] = React.useState(false);

  const canCreate = [
    'area_manager', 'store_manager', 'store_manager_assistant',
    'section_leader', 'senior_seller',
  ].includes(user.role);

  // "Mənim" - tasks assigned to me (excluding completed/cancelled)
  const mineTasks = React.useMemo(
    () =>
      tasks
        .filter(t =>
          t.assignedToId === user.id
          && t.status !== 'completed'
          && t.status !== 'cancelled',
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [tasks, user.id],
  );

  // "Verdiyim" - tasks I created or forwarded that are now with someone else
  const givenTasks = React.useMemo(
    () =>
      tasks
        .filter(t =>
          (t.createdById === user.id || t.forwardChain.includes(user.id))
          && t.assignedToId !== user.id
          && t.status !== 'cancelled',
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [tasks, user.id],
  );

  // "Təsdiq" - tasks waiting my approval (assigned to me with waiting_approval status)
  const approvalTasks = React.useMemo(
    () =>
      tasks
        .filter(t => t.assignedToId === user.id && t.status === 'waiting_approval')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [tasks, user.id],
  );

  const activeTasks = tab === 'mine' ? mineTasks : tab === 'given' ? givenTasks : approvalTasks;

  const navItems = React.useMemo(() => {
    const items: React.ComponentProps<typeof DashboardQuickNav>['items'] = [
      { icon: 'trophy', label: 'Liderlər', onPress: () => router.push('/store/leaderboard') },
      { icon: 'git-network', label: 'Struktur', onPress: () => router.push('/store/org-chart') },
    ];
    if (canCreate) {
      items.push({ icon: 'add-circle', label: 'Yeni', accent: BRAVO_COLORS.primary, onPress: () => router.push('/store/create') });
    }
    return items;
  }, [canCreate, router]);

  return (
    <View style={styles.container}>
      <BravoHeader
        title={`Salam, ${user.nameAz.split(' ')[0]}`}
        subtitle={`${user.roleLabelAz} · ${user.storeName}`}
        rightAction={(
          <Pressable onPress={logout} hitSlop={12}>
            <Ionicons name="log-out-outline" size={22} color={BRAVO_COLORS.textMuted} />
          </Pressable>
        )}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }}
            tintColor={BRAVO_COLORS.primary}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <DashboardQuickNav items={navItems} />
        <DashboardStats user={user} tasks={tasks} />

        {/* 3 tabs */}
        <View style={styles.taskSection}>
          <Text style={styles.taskSectionTitle}>Tapşırıqlar</Text>
          <View style={styles.tabRow}>
            <TabBtn
              label="Mənim"
              count={mineTasks.length}
              active={tab === 'mine'}
              onPress={() => setTab('mine')}
            />
            <TabBtn
              label="Verdiyim"
              count={givenTasks.length}
              active={tab === 'given'}
              onPress={() => setTab('given')}
            />
            <TabBtn
              label="Təsdiq"
              count={approvalTasks.length}
              active={tab === 'approval'}
              accent={approvalTasks.length > 0}
              onPress={() => setTab('approval')}
            />
          </View>

          {activeTasks.length === 0
            ? (
                <View style={styles.empty}>
                  <Ionicons name="folder-open-outline" size={44} color={BRAVO_COLORS.textLight} />
                  <Text style={styles.emptyText}>
                    {tab === 'mine'
                      ? 'Sizə verilmiş tapşırıq yoxdur'
                      : tab === 'given'
                        ? 'Verdiyiniz tapşırıq yoxdur'
                        : 'Təsdiq gözləyən tapşırıq yoxdur'}
                  </Text>
                </View>
              )
            : activeTasks.map(task => <TaskCard key={task.id} task={task} />)}
        </View>
      </ScrollView>

      {canCreate
        ? (
            <Pressable
              style={[styles.fab, { bottom: insets.bottom + 24 }]}
              onPress={() => router.push('/store/create')}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </Pressable>
          )
        : null}
    </View>
  );
}

function TabBtn({
  label,
  count,
  active,
  accent,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  accent?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.tab, active && styles.tabActive, !active && accent && styles.tabAccent]}
      onPress={onPress}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      <View style={[styles.tabBadge, active && styles.tabBadgeActive, !active && accent && styles.tabBadgeAccent]}>
        <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>{count}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 16 },
  taskSection: { marginTop: 20 },
  taskSectionTitle: { fontSize: 17, fontWeight: '700', color: BRAVO_COLORS.text, marginBottom: 12 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: BRAVO_COLORS.surface, borderWidth: 1, borderColor: BRAVO_COLORS.border },
  tabActive: { backgroundColor: BRAVO_COLORS.primary, borderColor: BRAVO_COLORS.primary },
  tabAccent: { borderColor: '#F97316' },
  tabLabel: { fontSize: 13, fontWeight: '600', color: BRAVO_COLORS.textMuted },
  tabLabelActive: { color: '#fff' },
  tabBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: BRAVO_COLORS.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabBadgeAccent: { backgroundColor: '#FFF7ED' },
  tabBadgeText: { fontSize: 11, fontWeight: '700', color: BRAVO_COLORS.textMuted },
  tabBadgeTextActive: { color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: 44, gap: 12 },
  emptyText: { fontSize: 14, color: BRAVO_COLORS.textMuted, textAlign: 'center' },
  fab: { position: 'absolute', right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: BRAVO_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: BRAVO_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
});
