import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
};

export function BravoHeader({
  title,
  subtitle,
  showBack = false,
  rightAction,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {showBack
          ? (
              <Pressable
                onPress={() => router.back()}
                style={styles.backBtn}
                hitSlop={12}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={BRAVO_COLORS.primary}
                />
              </Pressable>
            )
          : (
              <View style={styles.logoMark}>
                <Text style={styles.logoText}>B</Text>
              </View>
            )}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BRAVO_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: BRAVO_COLORS.border,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BRAVO_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BRAVO_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: BRAVO_COLORS.textMuted,
    marginTop: 2,
  },
  placeholder: { width: 40 },
});
