import type { DashboardFilter } from '../components/dashboard-filters';
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
import { DashboardFilters } from '../components/dashboard-filters';
import { DashboardQuickNav } from '../components/dashboard-quick-nav';
import { DashboardStats } from '../components/dashboard-stats';
import { ManagerBanner } from '../components/manager-banner';
import { TaskCard } from '../components/task-card';
import { BRAVO_COLORS } from '../constants/theme';
import { filterDashboardTasks } from '../lib/filter-dashboard-tasks';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useBravoSession.use.user()!;
  const logout = useBravoSession.use.logout();
  const tasks = useTaskStore.use.tasks();
  const [filter, setFilter] = React.useState<DashboardFilter>('all');
  const [refreshing, setRefreshing] = React.useState(false);

  const isManager
    = user.role === 'store_manager'
      || user.role === 'regional_manager'
      || user.role === 'department_head';
  const canCreate = isManager || user.canCreateITTicket;

  const filteredTasks = React.useMemo(
    () => filterDashboardTasks(tasks, user, filter),
    [tasks, user, filter],
  );

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

        <DashboardFilters value={filter} onChange={setFilter} />

        <Text style={styles.sectionTitle}>
          {`Tapşırıqlar (${filteredTasks.length})`}
        </Text>

        {filteredTasks.length === 0
          ? (
              <View style={styles.empty}>
                <Ionicons name="folder-open-outline" size={48} color={BRAVO_COLORS.textLight} />
                <Text style={styles.emptyText}>Bu filtrdə tapşırıq yoxdur</Text>
              </View>
            )
          : (
              filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  scroll: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
    marginTop: 20,
    marginBottom: 12,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: { fontSize: 14, color: BRAVO_COLORS.textMuted },
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
