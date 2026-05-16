import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BravoHeader } from '../components/bravo-header';
import { DashboardQuickNav } from '../components/dashboard-quick-nav';
import { DashboardStats } from '../components/dashboard-stats';
import { ManagerBanner } from '../components/manager-banner';
import { TaskCard } from '../components/task-card';
import { BRAVO_COLORS } from '../constants/theme';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

type TaskTab = 'given' | 'received' | 'pool';

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useBravoSession.use.user()!;
  const logout = useBravoSession.use.logout();
  const tasks = useTaskStore.use.tasks();
  const [tab, setTab] = React.useState<TaskTab>('received');
  const [refreshing, setRefreshing] = React.useState(false);

  const isManager
    = user.role === 'store_manager'
      || user.role === 'regional_manager'
      || user.role === 'department_head';
  const canCreate = isManager || user.canCreateITTicket;

  const storeTasks = React.useMemo(
    () => tasks.filter(t => t.storeId === user.storeId || t.type === 'it_ticket'),
    [tasks, user.storeId],
  );

  const givenTasks = React.useMemo(
    () =>
      storeTasks
        .filter(t => t.createdById === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [storeTasks, user.id],
  );

  const receivedTasks = React.useMemo(
    () =>
      storeTasks
        .filter(
          t =>
            t.assignedToId === user.id
            || t.claimedById === user.id,
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [storeTasks, user.id],
  );

  const poolTasks = React.useMemo(
    () =>
      storeTasks
        .filter(t => t.status === 'open_pool')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [storeTasks],
  );

  const activeTasks = tab === 'given' ? givenTasks : tab === 'received' ? receivedTasks : poolTasks;

  const navItems = React.useMemo(() => {
    const items: React.ComponentProps<typeof DashboardQuickNav>['items'] = [
      {
        icon: 'trophy',
        label: 'Liderlər',
        onPress: () => router.push('/store/leaderboard'),
      },
      {
        icon: 'git-network',
        label: 'Struktur',
        onPress: () => router.push('/store/org-chart'),
      },
    ];
    if (canCreate) {
      items.push({
        icon: 'add-circle',
        label: 'Yeni',
        accent: BRAVO_COLORS.primary,
        onPress: () => router.push('/store/create'),
      });
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
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 800);
            }}
            tintColor={BRAVO_COLORS.primary}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <DashboardQuickNav items={navItems} />
        <DashboardStats user={user} tasks={tasks} isManager={isManager} />
        {isManager ? <ManagerBanner /> : null}

        {/* Task section */}
        <View style={styles.taskSection}>
          <Text style={styles.taskSectionTitle}>Tapşırıqlar</Text>

          {/* 3 tabs */}
          <View style={styles.tabRow}>
            <TabButton
              label="Verdiyim"
              count={givenTasks.length}
              active={tab === 'given'}
              onPress={() => setTab('given')}
            />
            <TabButton
              label="Aldığım"
              count={receivedTasks.length}
              active={tab === 'received'}
              onPress={() => setTab('received')}
            />
            <TabButton
              label="Hovuz"
              count={poolTasks.length}
              active={tab === 'pool'}
              onPress={() => setTab('pool')}
            />
          </View>

          {/* Task list */}
          {activeTasks.length === 0
            ? (
                <View style={styles.empty}>
                  <Ionicons name="folder-open-outline" size={44} color={BRAVO_COLORS.textLight} />
                  <Text style={styles.emptyText}>
                    {tab === 'given'
                      ? 'Verdiyiniz tapşırıq yoxdur'
                      : tab === 'received'
                        ? 'Sizə verilmiş tapşırıq yoxdur'
                        : 'Açıq hovuz tapşırığı yoxdur'}
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

function TabButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
        <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 16 },

  taskSection: { marginTop: 20 },
  taskSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
    marginBottom: 12,
  },

  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: BRAVO_COLORS.surface,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  tabActive: {
    backgroundColor: BRAVO_COLORS.primary,
    borderColor: BRAVO_COLORS.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAVO_COLORS.textMuted,
  },
  tabLabelActive: { color: '#fff' },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BRAVO_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAVO_COLORS.textMuted,
  },
  tabBadgeTextActive: { color: '#fff' },

  empty: {
    alignItems: 'center',
    paddingVertical: 44,
    gap: 12,
  },
  emptyText: { fontSize: 14, color: BRAVO_COLORS.textMuted, textAlign: 'center' },

  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAVO_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAVO_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
