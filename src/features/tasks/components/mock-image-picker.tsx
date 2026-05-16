import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';

const MOCK_IMAGES = [
  'https://placehold.co/600x400/E8F5EE/008A4B?text=Şəkil+1',
  'https://placehold.co/600x400/F5F7FA/64748B?text=Şəkil+2',
  'https://placehold.co/600x400/DCFCE7/166534?text=Şəkil+3',
];

type Props = {
  label: string;
  hint: string;
  imageUrl?: string;
  onImageSelected: (url: string) => void;
  variant?: 'before' | 'after';
};

export function MockImagePicker({
  label,
  hint,
  imageUrl,
  onImageSelected,
  variant = 'before',
}: Props) {
  const [loading, setLoading] = React.useState(false);

  const pickImage = () => {
    setLoading(true);
    setTimeout(() => {
      const url
        = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]!;
      onImageSelected(url);
      setLoading(false);
    }, 600);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.hint}>{hint}</Text>
      <Pressable
        style={[
          styles.picker,
          imageUrl && styles.pickerFilled,
          variant === 'after' && styles.pickerAfter,
        ]}
        onPress={pickImage}
        disabled={loading}
      >
        {loading
          ? (
              <ActivityIndicator color={BRAVO_COLORS.primary} />
            )
          : imageUrl
            ? (
                <>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.preview}
                    contentFit="cover"
                  />
                  <View style={styles.changeOverlay}>
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.changeText}>Dəyişdir</Text>
                  </View>
                </>
              )
            : (
                <>
                  <View
                    style={[
                      styles.iconCircle,
                      variant === 'after' && styles.iconCircleAfter,
                    ]}
                  >
                    <Ionicons
                      name={variant === 'before' ? 'image-outline' : 'checkmark-circle-outline'}
                      size={28}
                      color={BRAVO_COLORS.primary}
                    />
                  </View>
                  <Text style={styles.pickText}>
                    {variant === 'before' ? 'Əvvəl şəkli əlavə et' : 'Son şəkil yüklə'}
                  </Text>
                  <Text style={styles.pickSubtext}>Kamera / Qalereya (simulyasiya)</Text>
                </>
              )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: BRAVO_COLORS.textMuted,
    marginBottom: 8,
  },
  picker: {
    height: 160,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: BRAVO_COLORS.border,
    backgroundColor: BRAVO_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerFilled: {
    borderStyle: 'solid',
    borderColor: BRAVO_COLORS.primary,
  },
  pickerAfter: {
    borderColor: BRAVO_COLORS.primary,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAVO_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleAfter: {
    backgroundColor: '#D1FAE5',
  },
  pickText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
  },
  pickSubtext: {
    fontSize: 11,
    color: BRAVO_COLORS.textLight,
    marginTop: 4,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
