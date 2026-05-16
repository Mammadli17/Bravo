import type { BravoUser, TaskItem } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getSubordinates } from '../data/mock-data';
import { getSectionLabel } from '../lib/sections';
import { useTaskStore } from '../use-task-store';
import { MockImagePicker } from './mock-image-picker';

type Props = { task: TaskItem; user: BravoUser };

export function TaskDetailActions({ task, user }: Props) {
  const forwardTask = useTaskStore.use.forwardTask();
  const startTask = useTaskStore.use.startTask();
  const completeTask = useTaskStore.use.completeTask();
  const approveTask = useTaskStore.use.approveTask();
  const rejectTask = useTaskStore.use.rejectTask();
  const requestRework = useTaskStore.use.requestRework();

  const [afterImage, setAfterImage] = React.useState(task.afterImageUrl ?? '');
  const [closingNote, setClosingNote] = React.useState(task.closingNote ?? '');
  const [approvalNote, setApprovalNote] = React.useState('');
  const [forwardTo, setForwardTo] = React.useState<string | undefined>();
  const [showForward, setShowForward] = React.useState(false);

  const isAssigned = task.assignedToId === user.id;
  const subordinates = React.useMemo(() => getSubordinates(user.id), [user.id]);
  const canForward = isAssigned && (task.status === 'assigned' || task.status === 'in_progress') && subordinates.length > 0;
  const canStart = isAssigned && task.status === 'assigned';
  const canComplete = isAssigned && task.status === 'in_progress';
  const canApprove = isAssigned && task.status === 'waiting_approval';

  if (!isAssigned && task.status !== 'waiting_approval') return null;
  if (task.status === 'completed' || task.status === 'cancelled') return null;

  const handleForward = () => {
    if (!forwardTo) { Alert.alert('Diqqət', 'İşçi seçin'); return; }
    const sub = subordinates.find(s => s.id === forwardTo);
    const ok = forwardTask({ taskId: task.id, fromUserId: user.id, fromUserName: user.nameAz, toUserId: forwardTo, toUserName: sub?.nameAz ?? '' });
    if (ok) { showMessage({ message: 'Yönləndirildi', type: 'success' }); setShowForward(false); }
  };

  const handleStart = () => {
    startTask({ taskId: task.id, userId: user.id, userName: user.nameAz });
    showMessage({ message: 'İşə başlandı', type: 'success' });
  };

  const handleComplete = () => {
    if (!afterImage) { Alert.alert('Diqqət', 'Son şəkil lazımdır'); return; }
    if (!closingNote.trim()) { Alert.alert('Diqqət', 'Bağlama qeydi yazın'); return; }
    const result = completeTask({ taskId: task.id, userId: user.id, userName: user.nameAz, afterImageUrl: afterImage, closingNote: closingNote.trim() });
    if (result.success) showMessage({ message: `Təsdiqlənmə üçün göndərildi! +${result.pointsEarned} xal`, type: 'success' });
  };

  const handleApprove = () => {
    approveTask({ taskId: task.id, userId: user.id, userName: user.nameAz, note: approvalNote.trim() || undefined });
    showMessage({ message: 'Tapşırıq təsdiqləndi', type: 'success' });
  };

  const handleReject = () => {
    Alert.alert('Rədd et', 'Bu tapşırığı rədd etmək istəyirsiniz?', [
      { text: 'Xeyr' },
      {
        text: 'Bəli, rədd et',
        style: 'destructive',
        onPress: () => {
          rejectTask({ taskId: task.id, userId: user.id, userName: user.nameAz, note: approvalNote.trim() || undefined });
          showMessage({ message: 'Tapşırıq rədd edildi', type: 'warning' });
        },
      },
    ]);
  };

  const handleRework = () => {
    if (!approvalNote.trim()) { Alert.alert('Diqqət', 'Yenidən işlənmə üçün qeyd yazın'); return; }
    requestRework({ taskId: task.id, userId: user.id, userName: user.nameAz, note: approvalNote.trim() });
    showMessage({ message: 'Yenidən işlənmə tələb edildi', type: 'warning' });
  };

  return (
    <View style={styles.container}>

      {/* Forward */}
      {canForward
        ? (
            <View style={styles.section}>
              <Pressable style={styles.sectionHeader} onPress={() => setShowForward(o => !o)}>
                <Ionicons name="arrow-redo-outline" size={20} color={BRAVO_COLORS.primary} />
                <Text style={styles.sectionTitle}>Yönləndir</Text>
                <Ionicons name={showForward ? 'chevron-up' : 'chevron-down'} size={16} color={BRAVO_COLORS.textMuted} />
              </Pressable>
              {showForward && (
                <View style={styles.forwardList}>
                  {subordinates.map(s => (
                    <Pressable
                      key={s.id}
                      style={[styles.forwardItem, forwardTo === s.id && styles.forwardItemActive]}
                      onPress={() => setForwardTo(s.id)}
                    >
                      <View style={styles.forwardAvatar}>
                        <Text style={styles.forwardInitial}>
                          {s.nameAz.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </Text>
                      </View>
                      <View style={styles.forwardInfo}>
                        <Text style={[styles.forwardName, forwardTo === s.id && styles.forwardNameActive]}>{s.nameAz}</Text>
                        <Text style={styles.forwardRole}>
                          {s.roleLabelAz}{s.sectionId ? ` · ${getSectionLabel(s.sectionId)}` : ''}
                        </Text>
                      </View>
                      {forwardTo === s.id ? <Ionicons name="checkmark-circle" size={18} color={BRAVO_COLORS.primary} /> : null}
                    </Pressable>
                  ))}
                  <Pressable style={styles.actionBtn} onPress={handleForward}>
                    <Text style={styles.actionBtnText}>Yönləndir</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )
        : null}

      {/* Start Work */}
      {canStart
        ? (
            <Pressable style={styles.startBtn} onPress={handleStart}>
              <Ionicons name="play-circle-outline" size={22} color={BRAVO_COLORS.primary} />
              <Text style={styles.startBtnText}>İşə Başla</Text>
            </Pressable>
          )
        : null}

      {/* Complete */}
      {canComplete
        ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tapşırığı Tamamla</Text>
              <MockImagePicker label="Son şəkil" hint="Tamamlanmış vəziyyəti göstərin" imageUrl={afterImage} onImageSelected={setAfterImage} variant="after" />
              <Text style={styles.inputLabel}>Bağlama qeydi</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Nə edildi, qısa təsvir..."
                placeholderTextColor={BRAVO_COLORS.textLight}
                value={closingNote}
                onChangeText={setClosingNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Pressable style={styles.completeBtn} onPress={handleComplete}>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.completeBtnText}>Tamamla və Göndər</Text>
              </Pressable>
            </View>
          )
        : null}

      {/* Approve / Reject */}
      {canApprove
        ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Təsdiq / Rədd</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Qeyd (opsional)..."
                placeholderTextColor={BRAVO_COLORS.textLight}
                value={approvalNote}
                onChangeText={setApprovalNote}
              />
              <View style={styles.approvalRow}>
                <Pressable style={styles.approveBtn} onPress={handleApprove}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.approveBtnText}>Təsdiqlə</Text>
                </Pressable>
                <Pressable style={styles.reworkBtn} onPress={handleRework}>
                  <Ionicons name="refresh-circle-outline" size={18} color="#C2410C" />
                  <Text style={styles.reworkBtnText}>Yenidən işlən</Text>
                </Pressable>
                <Pressable style={styles.rejectBtn} onPress={handleReject}>
                  <Ionicons name="close-circle-outline" size={18} color="#B91C1C" />
                  <Text style={styles.rejectBtnText}>Rədd et</Text>
                </Pressable>
              </View>
            </View>
          )
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  section: { backgroundColor: BRAVO_COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: BRAVO_COLORS.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: BRAVO_COLORS.text },
  forwardList: { marginTop: 12, gap: 8 },
  forwardItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: BRAVO_COLORS.background, borderWidth: 1, borderColor: BRAVO_COLORS.border },
  forwardItemActive: { borderColor: BRAVO_COLORS.primary, backgroundColor: BRAVO_COLORS.primaryLight },
  forwardAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: BRAVO_COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  forwardInitial: { fontSize: 12, fontWeight: '700', color: '#fff' },
  forwardInfo: { flex: 1 },
  forwardName: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text },
  forwardNameActive: { color: BRAVO_COLORS.primaryDark },
  forwardRole: { fontSize: 11, color: BRAVO_COLORS.textMuted, marginTop: 1 },
  actionBtn: { backgroundColor: BRAVO_COLORS.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BRAVO_COLORS.surface, borderRadius: 14, height: 50, borderWidth: 2, borderColor: BRAVO_COLORS.primary, marginBottom: 12 },
  startBtnText: { color: BRAVO_COLORS.primary, fontSize: 16, fontWeight: '700' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: BRAVO_COLORS.text, marginBottom: 8, marginTop: 4 },
  textArea: { backgroundColor: BRAVO_COLORS.background, borderRadius: 12, borderWidth: 1, borderColor: BRAVO_COLORS.border, padding: 12, fontSize: 14, color: BRAVO_COLORS.text, minHeight: 80, marginBottom: 12 },
  completeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BRAVO_COLORS.primary, borderRadius: 12, height: 48 },
  completeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  noteInput: { backgroundColor: BRAVO_COLORS.background, borderRadius: 10, borderWidth: 1, borderColor: BRAVO_COLORS.border, paddingHorizontal: 12, height: 44, fontSize: 14, color: BRAVO_COLORS.text, marginBottom: 12 },
  approvalRow: { flexDirection: 'row', gap: 8 },
  approveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#047857', borderRadius: 12, height: 44 },
  approveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  reworkBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#FFF7ED', borderRadius: 12, height: 44, borderWidth: 1, borderColor: '#C2410C' },
  reworkBtnText: { color: '#C2410C', fontWeight: '700', fontSize: 12 },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#FEF2F2', borderRadius: 12, height: 44, borderWidth: 1, borderColor: '#B91C1C' },
  rejectBtnText: { color: '#B91C1C', fontWeight: '700', fontSize: 12 },
});
