import type { LeaderboardEntry } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BravoHeader } from '../components/bravo-header';
import { BRAVO_COLORS } from '../constants/theme';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

type Period = 'weekly' | 'monthly';
type Scope = 'store' | 'chain';

export function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const user = useBravoSession.use.user()!;
  const leaderboard = useTaskStore.use.leaderboard();
  const [period, setPeriod] = React.useState<Period>('weekly');
  const [scope, setScope] = React.useState<Scope>('store');

  const sorted = React.useMemo(() => {
    let list = [...leaderboard];
    if (scope === 'store') {
      list = list.filter(
        e =>
          e.storeId === user.storeId
          && e.userId !== 'user-1003',
      );
    }
    list.sort((a, b) => {
      const ptsA = period === 'weekly' ? a.weeklyPoints : a.monthlyPoints;
      const ptsB = period === 'weekly' ? b.weeklyPoints : b.monthlyPoints;
      return ptsB - ptsA;
    });
    return list.map((entry, i) => ({ ...entry, rank: i + 1 }));
  }, [leaderboard, period, scope, user.storeId]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const myEntry = sorted.find(e => e.userId === user.id);

  return (
    <View style={styles.container}>
      <BravoHeader
        title="Ayın / Həftənin İşçisi"
        subtitle="Performans və mükafatlar"
        showBack
      />

      <View style={styles.tabs}>
        <TabButton label="Həftəlik" active={period === 'weekly'} onPress={() => setPeriod('weekly')} />
        <TabButton label="Aylıq" active={period === 'monthly'} onPress={() => setPeriod('monthly')} />
      </View>

      <View style={styles.scopeRow}>
        <ScopeButton label="Mağaza" active={scope === 'store'} onPress={() => setScope('store')} />
        <ScopeButton label="Şəbəkə üzrə" active={scope === 'chain'} onPress={() => setScope('chain')} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {top3.length >= 3
          ? (
              <View style={styles.podium}>
                <PodiumPlace entry={top3[1]!} place={2} period={period} />
                <PodiumPlace entry={top3[0]!} place={1} period={period} tall />
                <PodiumPlace entry={top3[2]!} place={3} period={period} />
              </View>
            )
          : null}

        {myEntry
          ? (
              <View style={styles.myCard}>
                <Text style={styles.myLabel}>Sizin mövqeyiniz</Text>
                <LeaderboardRow entry={myEntry} period={period} highlight />
              </View>
            )
          : null}

        <Text style={styles.listTitle}>Tam sıralama</Text>
        {rest.map(entry => (
          <LeaderboardRow key={entry.userId} entry={entry} period={period} />
        ))}

        <Text style={styles.badgesTitle}>Mükafat nişanları</Text>
        <View style={styles.badgesGrid}>
          <BadgeCard icon="flash" label="Sürətli Həll" color="#F59E0B" />
          <BadgeCard icon="grid" label="Qüsursuz Rəf" color={BRAVO_COLORS.primary} />
          <BadgeCard icon="hardware-chip" label="IT Qəhrəmanı" color="#6366F1" />
          <BadgeCard icon="ribbon" label="Ayın Ulduzu" color={BRAVO_COLORS.gold} />
        </View>
      </ScrollView>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ScopeButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.scopeBtn, active && styles.scopeBtnActive]}
      onPress={onPress}
    >
      <Text style={[styles.scopeText, active && styles.scopeTextActive]}>{label}</Text>
    </Pressable>
  );
}

function PodiumPlace({
  entry,
  place,
  period,
  tall,
}: {
  entry: LeaderboardEntry;
  place: number;
  period: Period;
  tall?: boolean;
}) {
  const pts = period === 'weekly' ? entry.weeklyPoints : entry.monthlyPoints;
  const medalColor
    = place === 1 ? BRAVO_COLORS.gold : place === 2 ? BRAVO_COLORS.silver : BRAVO_COLORS.bronze;

  return (
    <View style={[styles.podiumCol, tall && styles.podiumColTall]}>
      <View style={[styles.medal, { backgroundColor: medalColor }]}>
        <Text style={styles.medalNum}>{place}</Text>
      </View>
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${entry.employeeId}` }}
        style={[styles.podiumAvatar, tall && styles.podiumAvatarTall]}
      />
      <Text style={styles.podiumName} numberOfLines={1}>
        {entry.nameAz.split(' ')[0]}
      </Text>
      <Text style={styles.podiumPts}>
        {pts}
        {' '}
        xal
      </Text>
      <View style={[styles.podiumBar, { height: tall ? 80 : 56, backgroundColor: medalColor }]} />
    </View>
  );
}

function LeaderboardRow({
  entry,
  period,
  highlight,
}: {
  entry: LeaderboardEntry & { rank: number };
  period: Period;
  highlight?: boolean;
}) {
  const pts = period === 'weekly' ? entry.weeklyPoints : entry.monthlyPoints;

  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <Text style={styles.rank}>
        #
        {entry.rank}
      </Text>
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${entry.employeeId}` }}
        style={styles.rowAvatar}
      />
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{entry.nameAz}</Text>
        <Text style={styles.rowStore}>{entry.storeName}</Text>
        <View style={styles.rowMeta}>
          <Text style={styles.rowStat}>
            {entry.tasksCompleted}
            {' '}
            tapşırıq
          </Text>
          <Text style={styles.rowStat}>
            {entry.onTimeRate}
            % vaxtında
          </Text>
        </View>
        {entry.badges.length > 0
          ? (
              <View style={styles.badgeRow}>
                {entry.badges.map(b => (
                  <View key={b.id} style={styles.miniBadge}>
                    <Text style={styles.miniBadgeText}>{b.labelAz}</Text>
                  </View>
                ))}
              </View>
            )
          : null}
      </View>
      <Text style={styles.rowPts}>{pts}</Text>
    </View>
  );
}

function BadgeCard({
  icon,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
}) {
  return (
    <View style={styles.badgeCard}>
      <View style={[styles.badgeIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: { backgroundColor: BRAVO_COLORS.primary },
  tabText: { fontWeight: '600', color: BRAVO_COLORS.textMuted },
  tabTextActive: { color: '#fff' },
  scopeRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
  },
  scopeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: BRAVO_COLORS.surface,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  scopeBtnActive: {
    borderColor: BRAVO_COLORS.primary,
    backgroundColor: BRAVO_COLORS.primaryLight,
  },
  scopeText: { fontWeight: '600', color: BRAVO_COLORS.textMuted, fontSize: 13 },
  scopeTextActive: { color: BRAVO_COLORS.primary },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
  },
  podiumCol: { alignItems: 'center', flex: 1 },
  podiumColTall: { marginBottom: 0 },
  medal: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  medalNum: { color: '#fff', fontWeight: '800', fontSize: 14 },
  podiumAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: BRAVO_COLORS.border,
    marginBottom: 6,
  },
  podiumAvatarTall: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderColor: BRAVO_COLORS.gold,
    borderWidth: 3,
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    maxWidth: 90,
    textAlign: 'center',
  },
  podiumPts: {
    fontSize: 12,
    color: BRAVO_COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 8,
  },
  podiumBar: {
    width: '80%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    opacity: 0.85,
  },
  myCard: {
    backgroundColor: BRAVO_COLORS.primaryLight,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.primary,
  },
  myLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAVO_COLORS.primaryDark,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    gap: 12,
  },
  rowHighlight: {
    borderColor: BRAVO_COLORS.primary,
    backgroundColor: BRAVO_COLORS.primaryLight,
  },
  rank: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAVO_COLORS.textMuted,
    width: 32,
  },
  rowAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '600', color: BRAVO_COLORS.text },
  rowStore: { fontSize: 11, color: BRAVO_COLORS.textMuted },
  rowMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  rowStat: { fontSize: 11, color: BRAVO_COLORS.textLight },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  miniBadge: {
    backgroundColor: BRAVO_COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniBadgeText: { fontSize: 9, color: BRAVO_COLORS.primary, fontWeight: '600' },
  rowPts: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAVO_COLORS.primary,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    textAlign: 'center',
  },
});
