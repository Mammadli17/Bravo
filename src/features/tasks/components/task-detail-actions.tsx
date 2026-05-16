import type { BravoUser, TaskItem } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { useTaskStore } from '../use-task-store';
import { MockImagePicker } from './mock-image-picker';

type Props = {
  task: TaskItem;
  user: BravoUser;
  canClaim: boolean;
  canClaimIT: boolean;
  canComplete: boolean;
};

export function TaskDetailActions({
  task,
  user,
  canClaim,
  canClaimIT,
  canComplete,
}: Props) {
  const claimTask = useTaskStore.use.claimTask();
  const completeTask = useTaskStore.use.completeTask();
  const [afterImage, setAfterImage] = React.useState(task.afterImageUrl ?? '');
  const [closingNote, setClosingNote] = React.useState(task.closingNote ?? '');

  const handleClaim = () => {
    const ok = claimTask({
      taskId: task.id,
      userId: user.id,
      userName: user.nameAz,
    });
    if (ok)
      showMessage({ message: 'Tapşırıq götürüldü!', type: 'success' });
    else Alert.alert('Xəta', 'Bu tapşırığı götürmək mümkün deyil');
  };

  const handleComplete = () => {
    if (!afterImage) {
      Alert.alert('Diqqət', 'Tamamlamaq üçün son şəkil lazımdır');
      return;
    }
    if (!closingNote.trim()) {
      Alert.alert('Diqqət', 'Bağlama təsviri daxil edin');
      return;
    }
    const result = completeTask({
      taskId: task.id,
      userId: user.id,
      userName: user.nameAz,
      afterImageUrl: afterImage,
      closingNote: closingNote.trim(),
    });
    if (result.success) {
      showMessage({
        message: `Təbriklər! +${result.pointsEarned} xal qazandınız`,
        type: 'success',
      });
    }
    else {
      Alert.alert('Xəta', 'Tamamlamaq mümkün olmadı');
    }
  };

  if (task.status === 'done')
    return null;

  return (
    <>
      {canComplete
        ? (
            <View style={styles.completeSection}>
              <Text style={styles.sectionTitle}>Tapşırığı Tamamla</Text>
              <MockImagePicker
                label="Son Şəkil (Təmiz)"
                hint="Həll edilmiş vəziyyəti göstərin"
                imageUrl={afterImage}
                onImageSelected={setAfterImage}
                variant="after"
              />
              <Text style={styles.inputLabel}>Bağlama təsviri</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Nə edildi, qısa təsvir..."
                placeholderTextColor={BRAVO_COLORS.textLight}
                value={closingNote}
                onChangeText={setClosingNote}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Pressable style={styles.completeBtn} onPress={handleComplete}>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.completeBtnText}>Tamamla və Təsdiqlə</Text>
              </Pressable>
            </View>
          )
        : null}

      {(canClaim || canClaimIT)
        ? (
            <Pressable style={styles.claimBtn} onPress={handleClaim}>
              <Ionicons name="hand-left-outline" size={22} color={BRAVO_COLORS.primary} />
              <Text style={styles.claimBtnText}>
                {task.type === 'it_ticket' ? 'IT Biletini Qəbul Et' : 'Tapşırığı Götür'}
              </Text>
            </Pressable>
          )
        : null}
    </>
  );
}

const styles = StyleSheet.create({
  completeSection: {
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAVO_COLORS.text,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: BRAVO_COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    padding: 14,
    fontSize: 14,
    color: BRAVO_COLORS.text,
    minHeight: 100,
    marginBottom: 16,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAVO_COLORS.primary,
    borderRadius: 14,
    height: 50,
  },
  completeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 14,
    height: 50,
    borderWidth: 2,
    borderColor: BRAVO_COLORS.primary,
    marginBottom: 24,
  },
  claimBtnText: {
    color: BRAVO_COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
