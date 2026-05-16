import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { DEMO_HINTS } from '../data/mock-data';

type Props = { onSelect: (id: string) => void };

export function LoginDemoAccounts({ onSelect }: Props) {
  return (
    <>
      <Text style={styles.demoTitle}>Demo hesablar</Text>
      <View style={styles.demoRow}>
        {DEMO_HINTS.map(hint => (
          <Pressable
            key={hint.id}
            style={styles.demoChip}
            onPress={() => onSelect(hint.id)}
          >
            <Text style={styles.demoId}>{hint.id}</Text>
            <Text style={styles.demoLabel}>{hint.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  demoTitle: {
    fontSize: 13,
    color: BRAVO_COLORS.textMuted,
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 12,
    fontWeight: '500',
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  demoChip: {
    flex: 1,
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  demoId: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAVO_COLORS.primary,
  },
  demoLabel: {
    fontSize: 10,
    color: BRAVO_COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
