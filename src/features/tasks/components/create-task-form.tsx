import type { BravoUser, TaskPriority, TaskType } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { CreateTaskAssignment } from './create-task-assignment';
import { CreateTaskCategoryPicker } from './create-task-category-picker';
import { CreateTaskOptions } from './create-task-options';
import { MockImagePicker } from './mock-image-picker';

export type CreateTaskFormState = {
  taskType: TaskType;
  title: string;
  description: string;
  priority: TaskPriority;
  categoryIndex: number;
  isGeneralPool: boolean;
  assigneeId?: string;
  beforeImage?: string;
  deadlineDays: number;
  deadlineHours: number;
};

type Props = {
  assignable: BravoUser[];
  itAssignable: BravoUser[];
  canOnlyIT: boolean;
  canCreateOperational: boolean;
  state: CreateTaskFormState;
  onChange: (patch: Partial<CreateTaskFormState>) => void;
  onSubmit: () => void;
};

export function CreateTaskForm({
  assignable,
  itAssignable,
  canOnlyIT,
  canCreateOperational,
  state,
  onChange,
  onSubmit,
}: Props) {
  const set = (patch: Partial<CreateTaskFormState>) => onChange(patch);
  const [itDropdownOpen, setItDropdownOpen] = React.useState(false);

  const selectedIT = itAssignable.find(u => u.id === state.assigneeId);

  return (
    <>
      {!canOnlyIT
        ? (
            <View style={styles.typeRow}>
              <TypeTab label="Operativ" active={state.taskType === 'operational'} onPress={() => set({ taskType: 'operational', assigneeId: undefined })} />
              <TypeTab label="IT Bilet" active={state.taskType === 'it_ticket'} onPress={() => set({ taskType: 'it_ticket', assigneeId: undefined })} />
            </View>
          )
        : null}

      <Field label="Başlıq">
        <TextInput style={styles.input} placeholder="Məs: Rəf düzəlişi" placeholderTextColor={BRAVO_COLORS.textLight} value={state.title} onChangeText={title => set({ title })} />
      </Field>
      <Field label="Təsvir">
        <TextInput style={[styles.input, styles.textArea]} placeholder="Tapşırığın detalları..." placeholderTextColor={BRAVO_COLORS.textLight} value={state.description} onChangeText={description => set({ description })} multiline numberOfLines={4} textAlignVertical="top" />
      </Field>

      {state.taskType === 'operational'
        ? (
            <>
              <CreateTaskCategoryPicker index={state.categoryIndex} onChange={categoryIndex => set({ categoryIndex })} />
              {canCreateOperational
                ? (
                    <CreateTaskAssignment
                      assignable={assignable}
                      isGeneralPool={state.isGeneralPool}
                      assigneeId={state.assigneeId}
                      onSelectPool={() => set({ isGeneralPool: !state.isGeneralPool })}
                      onSelectAssignee={id => set({ assigneeId: state.assigneeId === id ? undefined : id })}
                    />
                  )
                : null}
            </>
          )
        : (
            <View style={styles.itAssignSection}>
              <Text style={styles.fieldLabel}>Təyin et (opsional)</Text>
              <Pressable
                style={[styles.dropdownTrigger, itDropdownOpen && styles.dropdownTriggerOpen]}
                onPress={() => setItDropdownOpen(o => !o)}
              >
                <Text style={[styles.dropdownTriggerText, !selectedIT && styles.dropdownPlaceholder]}>
                  {selectedIT ? selectedIT.nameAz : 'İşçi seç...'}
                </Text>
                <Ionicons
                  name={itDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={BRAVO_COLORS.textMuted}
                />
              </Pressable>
              {itDropdownOpen && (
                <View style={styles.dropdownList}>
                  {itAssignable.length === 0
                    ? (
                        <Text style={styles.dropdownEmpty}>İşçi tapılmadı</Text>
                      )
                    : itAssignable.map(u => (
                        <Pressable
                          key={u.id}
                          style={[styles.dropdownItem, state.assigneeId === u.id && styles.dropdownItemActive]}
                          onPress={() => {
                            set({ assigneeId: state.assigneeId === u.id ? undefined : u.id });
                            setItDropdownOpen(false);
                          }}
                        >
                          <View>
                            <Text style={[styles.dropdownItemName, state.assigneeId === u.id && styles.dropdownItemNameActive]}>
                              {u.nameAz}
                            </Text>
                            <Text style={styles.dropdownItemRole}>{u.roleLabelAz}</Text>
                          </View>
                          {state.assigneeId === u.id && (
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                          )}
                        </Pressable>
                      ))}
                </View>
              )}
            </View>
          )}

      <CreateTaskOptions
        priority={state.priority}
        deadlineDays={state.deadlineDays}
        deadlineHours={state.deadlineHours}
        onPriorityChange={priority => set({ priority })}
        onDeadlineChange={deadlineDays => set({ deadlineDays })}
        onDeadlineHoursChange={deadlineHours => set({ deadlineHours })}
      />

      <MockImagePicker label="Əvvəl Şəkli" hint="Problemin fotosu" imageUrl={state.beforeImage} onImageSelected={beforeImage => set({ beforeImage })} variant="before" />

      <Pressable style={styles.submitBtn} onPress={onSubmit}>
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={styles.submitText}>Tapşırığı Yarat</Text>
      </Pressable>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function TypeTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.typeTab, active && styles.typeTabActive]} onPress={onPress}>
      <Text style={[styles.typeTabText, active && styles.typeTabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeTab: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: BRAVO_COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: BRAVO_COLORS.border },
  typeTabActive: { backgroundColor: BRAVO_COLORS.primary, borderColor: BRAVO_COLORS.primary },
  typeTabText: { fontWeight: '600', color: BRAVO_COLORS.textMuted },
  typeTabTextActive: { color: '#fff' },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginBottom: 8 },
  input: { backgroundColor: BRAVO_COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: BRAVO_COLORS.border, paddingHorizontal: 14, height: 48, fontSize: 15, color: BRAVO_COLORS.text },
  textArea: { height: 100, paddingTop: 14 },
  itAssignSection: { marginBottom: 16 },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    paddingHorizontal: 14,
    height: 48,
  },
  dropdownTriggerOpen: { borderColor: BRAVO_COLORS.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownTriggerText: { fontSize: 15, color: BRAVO_COLORS.text, fontWeight: '500' },
  dropdownPlaceholder: { color: BRAVO_COLORS.textLight },
  dropdownList: {
    backgroundColor: BRAVO_COLORS.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: BRAVO_COLORS.primary,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BRAVO_COLORS.border,
  },
  dropdownItemActive: { backgroundColor: BRAVO_COLORS.primary },
  dropdownItemName: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text },
  dropdownItemNameActive: { color: '#fff' },
  dropdownItemRole: { fontSize: 12, color: BRAVO_COLORS.textMuted, marginTop: 2 },
  dropdownEmpty: { padding: 14, fontSize: 13, color: BRAVO_COLORS.textMuted, textAlign: 'center' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BRAVO_COLORS.primary, borderRadius: 14, height: 52, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
