import type { LeaderboardEntry, UserRole } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BravoHeader } from '../components/bravo-header';
import { BRAVO_COLORS } from '../constants/theme';
import { MOCK_USERS } from '../data/mock-data';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

type Period = 'weekly' | 'monthly';
type Category = 'saticilar' | 'sobe_rehleri' | 'mudirler';

const CATEGORY_ROLES: Record<Category, UserRole[]> = {
  saticilar: ['seller', 'senior_seller'],
  sobe_rehleri: ['section_leader', 'store_manager_assistant'],
  mudirler: ['store_manager', 'area_manager'],
};

const CATEGORY_LABELS: Record<Category, string> = {
  saticilar: 'Satıcılar',
  sobe_rehleri: 'Şöbə Rəhbərləri',
  mudirler: 'Müdirlər',
};

const CATEGORY_ICONS: Record<Category, React.ComponentProps<typeof Ionicons>['name']> = {
  saticilar: 'storefront-outline',
  sobe_rehleri: 'layers-outline',
  mudirler: 'briefcase-outline',
};

function defaultCategory(role: UserRole): Category {
  if (role === 'seller' || role === 'senior_seller') return 'saticilar';
  if (role === 'section_leader' || role === 'store_manager_assistant') return 'sobe_rehleri';
  return 'mudirler';
}

const roleMap = Object.fromEntries(MOCK_USERS.map(u => [u.id, u]));
const RANK_COLORS = ['#F59E0B', '#9CA3AF', '#B45309'];

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('');
}

export function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const user = useBravoSession.use.user()!;
  const leaderboard = useTaskStore.use.leaderboard();
  const [period, setPeriod] = React.useState<Period>('weekly');
  const [category, setCategory] = React.useState<Category>(defaultCategory(user.role));

  const entries = React.useMemo(() => {
    const allowedRoles = CATEGORY_ROLES[category];
    return leaderboard
      .filter(e => {
        const u = roleMap[e.userId];
        return u && allowedRoles.includes(u.role);
      })
      .sort((a, b) => {
        const ptsA = period === 'weekly' ? a.weeklyPoints : a.monthlyPoints;
        const ptsB = period === 'weekly' ? b.weeklyPoints : b.monthlyPoints;
        return ptsB - ptsA;
      })
      .map((e, i) => ({ ...e, rank: i + 1 }));
  }, [leaderboard, period, category]);

  const myEntry = entries.find(e => e.userId === user.id);
  const maxPts = entries[0]
    ? (period === 'weekly' ? entries[0].weeklyPoints : entries[0].monthlyPoints)
    : 1;

  return (
    <View style={styles.container}>
      <BravoHeader title="Liderlik Sırası" showBack />

      <View style={styles.periodRow}>
        <Pressable style={[styles.periodBtn, period === 'weekly' && styles.periodBtnActive]} onPress={() => setPeriod('weekly')}>
          <Text style={[styles.periodText, period === 'weekly' && styles.periodTextActive]}>Həftəlik</Text>
        </Pressable>
        <Pressable style={[styles.periodBtn, period === 'monthly' && styles.periodBtnActive]} onPress={() => setPeriod('monthly')}>
          <Text style={[styles.periodText, period === 'monthly' && styles.periodTextActive]}>Aylıq</Text>
        </Pressable>
      </View>

      <View style={styles.catRow}>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
          <Pressable
            key={cat}
            style={[styles.catTab, category === cat && styles.catTabActive]}
            onPress={() => setCategory(cat)}
          >
            <Ionicons name={CATEGORY_ICONS[cat]} size={15} color={category === cat ? '#fff' : BRAVO_COLORS.textMuted} />
            <Text style={[styles.catTabText, category === cat && styles.catTabTextActive]}>
              {CATEGORY_LABELS[cat]}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {myEntry
          ? (
              <View style={styles.mySection}>
                <Text style={styles.mySectionLabel}>Sizin mövqeyiniz</Text>
                <EntryCard entry={myEntry} period={period} maxPts={maxPts} isMe />
              </View>
            )
          : null}

        {entries.length === 0
          ? (
              <View style={styles.empty}>
                <Ionicons name="podium-outline" size={48} color={BRAVO_COLORS.textLight} />
                <Text style={styles.emptyText}>Bu kateqoriyada məlumat yoxdur</Text>
              </View>
            )
          : entries.map(entry => (
              <EntryCard key={entry.userId} entry={entry} period={period} maxPts={maxPts} isMe={entry.userId === user.id} />
            ))}
      </ScrollView>
    </View>
  );
}

function EntryCard({
  entry,
  period,
  maxPts,
  isMe,
}: {
  entry: LeaderboardEntry & { rank: number };
  period: Period;
  maxPts: number;
  isMe?: boolean;
}) {
  const pts = period === 'weekly' ? entry.weeklyPoints : entry.monthlyPoints;
  const barWidth = maxPts > 0 ? (pts / maxPts) * 100 : 0;
  const rankColor = entry.rank <= 3 ? RANK_COLORS[entry.rank - 1]! : BRAVO_COLORS.textLight;
  const u = roleMap[entry.userId];

  return (
    <View style={[styles.card, isMe && styles.cardMe]}>
      <View style={[styles.rankBadge, { backgroundColor: entry.rank <= 3 ? rankColor : BRAVO_COLORS.border }]}>
        <Text style={[styles.rankText, entry.rank > 3 && styles.rankTextDark]}>{entry.rank}</Text>
      </View>
      <View style={[styles.avatar, isMe && styles.avatarMe]}>
        <Text style={styles.avatarText}>{initials(entry.nameAz)}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{entry.nameAz}</Text>
          {entry.rank <= 3 ? <Ionicons name="trophy" size={13} color={rankColor} /> : null}
        </View>
        <Text style={styles.role} numberOfLines={1}>{u?.roleLabelAz ?? ''}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${barWidth}%` as any, backgroundColor: isMe ? BRAVO_COLORS.primary : rankColor }]} />
        </View>
      </View>
      <View style={styles.ptsBlock}>
        <Text style={[styles.pts, { color: entry.rank <= 3 ? rankColor : BRAVO_COLORS.primary }]}>{pts}</Text>
        <Text style={styles.ptsLabel}>xal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  periodRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, backgroundColor: BRAVO_COLORS.surface, borderRadius: 12, padding: 3, borderWidth: 1, borderColor: BRAVO_COLORS.border },
  periodBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  periodBtnActive: { backgroundColor: BRAVO_COLORS.primary },
  periodText: { fontSize: 13, fontWeight: '600', color: BRAVO_COLORS.textMuted },
  periodTextActive: { color: '#fff' },
  catRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginTop: 10, marginBottom: 4 },
  catTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: 12, backgroundColor: BRAVO_COLORS.surface, borderWidth: 1, borderColor: BRAVO_COLORS.border },
  catTabActive: { backgroundColor: BRAVO_COLORS.primary, borderColor: BRAVO_COLORS.primary },
  catTabText: { fontSize: 11, fontWeight: '600', color: BRAVO_COLORS.textMuted },
  catTabTextActive: { color: '#fff' },
  mySection: { marginBottom: 16 },
  mySectionLabel: { fontSize: 12, fontWeight: '600', color: BRAVO_COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: BRAVO_COLORS.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: BRAVO_COLORS.border },
  cardMe: { borderColor: BRAVO_COLORS.primary, backgroundColor: BRAVO_COLORS.primaryLight },
  rankBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  rankTextDark: { color: BRAVO_COLORS.textMuted },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: BRAVO_COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarMe: { backgroundColor: BRAVO_COLORS.primaryDark ?? BRAVO_COLORS.primary },
  avatarText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: BRAVO_COLORS.text, flex: 1 },
  role: { fontSize: 11, color: BRAVO_COLORS.textMuted, marginBottom: 6 },
  barTrack: { height: 4, backgroundColor: BRAVO_COLORS.border, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 2 },
  ptsBlock: { alignItems: 'center' },
  pts: { fontSize: 20, fontWeight: '800' },
  ptsLabel: { fontSize: 10, color: BRAVO_COLORS.textMuted, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: BRAVO_COLORS.textMuted },
});
