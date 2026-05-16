import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { LoginDemoAccounts } from '../components/login-demo-accounts';
import { BRAVO_COLORS } from '../constants/theme';
import { useBravoSession } from '../use-bravo-session';

export function BravoLoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const login = useBravoSession.use.login();
  const [employeeId, setEmployeeId] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = () => {
    setError(null);
    if (!employeeId.trim()) {
      setError('İşçi ID daxil edin');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(employeeId);
      setLoading(false);
      if (result.success) {
        router.replace('/store');
      }
      else {
        setError(result.error ?? 'Giriş uğursuz');
      }
    }, 400);
  };

  const fillDemo = (id: string) => {
    setEmployeeId(id);
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logoLetter}>B</Text>
            </View>
          </View>
          <Text style={styles.brand}>BRAVO</Text>
          <Text style={styles.tagline}>Store Management</Text>
          <Text style={styles.subtagline}>Tapşırıq və İşçi İdarəetmə Sistemi</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>İşçi Girişi</Text>
          <Text style={styles.cardSubtitle}>
            Rəqəmsal İşçi ID ilə daxil olun
          </Text>

          <View style={styles.inputWrap}>
            <Ionicons
              name="id-card-outline"
              size={20}
              color={BRAVO_COLORS.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Məs: 1001"
              placeholderTextColor={BRAVO_COLORS.textLight}
              value={employeeId}
              onChangeText={setEmployeeId}
              keyboardType="number-pad"
              maxLength={6}
              autoCorrect={false}
              testID="employee-id-input"
            />
          </View>

          {error
            ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={BRAVO_COLORS.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )
            : null}

          <Pressable
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Yoxlanılır...' : 'Daxil Ol'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        </View>

        <LoginDemoAccounts onSelect={fillDemo} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAVO_COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoOuter: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: BRAVO_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: BRAVO_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: BRAVO_COLORS.primary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: BRAVO_COLORS.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  subtagline: {
    fontSize: 13,
    color: BRAVO_COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: BRAVO_COLORS.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAVO_COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    height: 52,
    fontSize: 18,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    letterSpacing: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: BRAVO_COLORS.danger,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAVO_COLORS.primary,
    borderRadius: 14,
    height: 52,
    marginTop: 8,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
