import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

export function ManagerBanner() {
  return (
    <View style={styles.managerBanner}>
      <Ionicons name="shield-checkmark" size={20} color={BRAVO_COLORS.primary} />
      <Text style={styles.managerText}>
        Tapşırıq təyin edə və ya Ümumi Hovuza əlavə edə bilərsiniz
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  managerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BRAVO_COLORS.primaryLight,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  managerText: {
    flex: 1,
    fontSize: 13,
    color: BRAVO_COLORS.primaryDark,
    fontWeight: '500',
    lineHeight: 18,
  },
});
