import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BravoHeader } from '../components/bravo-header';
import { OrgChartTree } from '../components/org-chart-tree';
import { BRAVO_COLORS } from '../constants/theme';
import { ORG_HIERARCHY } from '../data/mock-data';

export function OrgChartScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <BravoHeader
        title="Təşkilat Strukturu"
        subtitle="Bravo mağaza iyerarxiyası"
        showBack
      />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.legend}>
          <LegendItem color={BRAVO_COLORS.primary} label="Tapşırıq təyin edə bilər" />
          <LegendItem color={BRAVO_COLORS.border} label="Hesabat xətti" />
        </View>

        <Text style={styles.hint}>
          Regional Menecer → Mağaza Müdiri → Şöbə Rəhbəri → Satış işçiləri.
          IT dəstək regional səviyyədə paralel xidmət göstərir.
        </Text>

        <OrgChartTree root={ORG_HIERARCHY} />

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Tapşırıq icazələri</Text>
          <Rule text="Mağaza müdiri: hər kəsə təyin və ya Ümumi Hovuz" />
          <Rule text="Şöbə rəhbəri: öz şöbəsinə təyin edə bilər" />
          <Rule text="Satış işçisi: yalnız IT bilet yarada bilər" />
          <Rule text="IT: bütün IT biletlərini qəbul və həll edir" />
        </View>
      </ScrollView>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.ruleBullet} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  scroll: { padding: 16 },
  legend: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: BRAVO_COLORS.textMuted },
  hint: {
    fontSize: 13,
    color: BRAVO_COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  rulesCard: {
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  rulesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
    marginBottom: 12,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAVO_COLORS.primary,
    marginTop: 6,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: BRAVO_COLORS.textMuted,
    lineHeight: 18,
  },
});
