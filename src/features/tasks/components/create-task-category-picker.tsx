import * as React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { TASK_CATEGORIES } from '../lib/categories';

type Props = { index: number; onChange: (i: number) => void };

export function CreateTaskCategoryPicker({ index, onChange }: Props) {
  return (
    <>
      <Text style={styles.fieldLabel}>Kateqoriya</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {TASK_CATEGORIES.map((cat, i) => (
          <Pressable key={cat.en} style={[styles.chip, index === i && styles.chipActive]} onPress={() => onChange(i)}>
            <Text style={[styles.chipText, index === i && styles.chipTextActive]}>{cat.az}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginBottom: 8 },
  chipScroll: { marginBottom: 16, marginHorizontal: -16, paddingHorizontal: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: BRAVO_COLORS.surface, borderWidth: 1, borderColor: BRAVO_COLORS.border, marginRight: 8 },
  chipActive: { backgroundColor: BRAVO_COLORS.primary, borderColor: BRAVO_COLORS.primary },
  chipText: { fontSize: 13, color: BRAVO_COLORS.textMuted, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
});
