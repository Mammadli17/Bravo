import type { BravoUser } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

type Props = {
  assignable: BravoUser[];
  isGeneralPool: boolean;
  assigneeId?: string;
  onSelectPool: () => void;
  onSelectAssignee: (id: string) => void;
};

export function CreateTaskAssignment({
  assignable,
  isGeneralPool,
  assigneeId,
  onSelectPool,
  onSelectAssignee,
}: Props) {
  return (
    <>
      <Text style={styles.fieldLabel}>Təyinat</Text>
      <Pressable
        style={[styles.poolToggle, isGeneralPool && styles.poolToggleActive]}
        onPress={onSelectPool}
      >
        <Ionicons
          name="water"
          size={20}
          color={isGeneralPool ? '#fff' : BRAVO_COLORS.primary}
        />
        <Text style={[styles.poolText, isGeneralPool && styles.poolTextActive]}>
          Ümumi Hovuz (hər kəs götürə bilər)
        </Text>
      </Pressable>
      <Text style={styles.orText}>
        {isGeneralPool ? 'Əlavə olaraq birini də seç (opsional)' : 'və ya işçiyə təyin et'}
      </Text>
      {assignable.map(a => (
        <Pressable
          key={a.id}
          style={[
            styles.assigneeRow,
            assigneeId === a.id && styles.assigneeActive,
          ]}
          onPress={() => onSelectAssignee(a.id)}
        >
          <Text style={styles.assigneeName}>{a.nameAz}</Text>
          <Text style={styles.assigneeRole}>{a.roleLabelAz}</Text>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    marginBottom: 8,
  },
  poolToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BRAVO_COLORS.primary,
    backgroundColor: BRAVO_COLORS.surface,
    marginBottom: 12,
  },
  poolToggleActive: { backgroundColor: BRAVO_COLORS.primary },
  poolText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: BRAVO_COLORS.primary,
  },
  poolTextActive: { color: '#fff' },
  orText: {
    fontSize: 12,
    color: BRAVO_COLORS.textMuted,
    textAlign: 'center',
    marginVertical: 8,
  },
  assigneeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  assigneeActive: {
    borderColor: BRAVO_COLORS.primary,
    backgroundColor: BRAVO_COLORS.primaryLight,
  },
  assigneeName: { fontSize: 15, fontWeight: '600', color: BRAVO_COLORS.text },
  assigneeRole: { fontSize: 12, color: BRAVO_COLORS.textMuted },
});
