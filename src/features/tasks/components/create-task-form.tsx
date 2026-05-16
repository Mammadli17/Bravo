import type { BravoUser, TaskPriority } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getSectionLabel } from '../lib/sections';
import { CreateTaskOptions } from './create-task-options';
import { MockImagePicker } from './mock-image-picker';

export type CreateTaskFormState = {
  title: string;
  description: string;
  priority: TaskPriority;
  deadlineDays: number;
  deadlineHours: number;
  assigneeId?: string;
  beforeImage?: string;
};

type Props = {
  subordinates: BravoUser[];
  state: CreateTaskFormState;
  onChange: (patch: Partial<CreateTaskFormState>) => void;
  onSubmit: () => void;
};

export function CreateTaskForm({ subordinates, state, onChange, onSubmit }: Props) {
  const set = (patch: Partial<CreateTaskFormState>) => onChange(patch);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const selectedUser = subordinates.find(u => u.id === state.assigneeId);

  return (
    <>
      <Field label="Başlıq">
        <TextInput
          style={styles.input}
          placeholder="Tapşırığın başlığı..."
          placeholderTextColor={BRAVO_COLORS.textLight}
          value={state.title}
          onChangeText={title => set({ title })}
        />
      </Field>

      <Field label="Təsvir">
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tapşırığın detalları..."
          placeholderTextColor={BRAVO_COLORS.textLight}
          value={state.description}
          onChangeText={description => set({ description })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </Field>

      {subordinates.length > 0
        ? (
            <Field label="Kimə təyin et">
              <Pressable
                style={[styles.dropdownTrigger, dropdownOpen && styles.dropdownOpen]}
                onPress={() => setDropdownOpen(o => !o)}
              >
                <View style={styles.dropdownLeft}>
                  {selectedUser
                    ? (
                        <>
                          <Text style={styles.dropdownName}>{selectedUser.nameAz}</Text>
                          <Text style={styles.dropdownRole}>
                            {selectedUser.roleLabelAz}
                            {selectedUser.sectionId ? ` · ${getSectionLabel(selectedUser.sectionId)}` : ''}
                          </Text>
                        </>
                      )
                    : <Text style={styles.dropdownPlaceholder}>İşçi seç...</Text>}
                </View>
                <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color={BRAVO_COLORS.textMuted} />
              </Pressable>
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {subordinates.map(u => (
                    <Pressable
                      key={u.id}
                      style={[styles.dropdownItem, state.assigneeId === u.id && styles.dropdownItemActive]}
                      onPress={() => {
                        set({ assigneeId: u.id });
                        setDropdownOpen(false);
                      }}
                    >
                      <View style={styles.dropdownItemAvatar}>
                        <Text style={styles.dropdownItemInitial}>
                          {u.nameAz.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </Text>
                      </View>
                      <View style={styles.dropdownItemInfo}>
                        <Text style={[styles.dropdownItemName, state.assigneeId === u.id && styles.dropdownItemNameActive]}>
                          {u.nameAz}
                        </Text>
                        <Text style={styles.dropdownItemRole}>
                          {u.roleLabelAz}
                          {u.sectionId ? ` · ${getSectionLabel(u.sectionId)}` : ''}
                        </Text>
                      </View>
                      {state.assigneeId === u.id
                        ? <Ionicons name="checkmark-circle" size={20} color={BRAVO_COLORS.primary} />
                        : null}
                    </Pressable>
                  ))}
                </View>
              )}
            </Field>
          )
        : null}

      <CreateTaskOptions
        priority={state.priority}
        deadlineDays={state.deadlineDays}
        deadlineHours={state.deadlineHours}
        onPriorityChange={priority => set({ priority })}
        onDeadlineChange={deadlineDays => set({ deadlineDays })}
        onDeadlineHoursChange={deadlineHours => set({ deadlineHours })}
      />

      <MockImagePicker
        label="Şəkil (opsional)"
        hint="Problemi göstərən foto"
        imageUrl={state.beforeImage}
        onImageSelected={beforeImage => set({ beforeImage })}
        variant="before"
      />

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

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text, marginBottom: 8 },
  input: { backgroundColor: BRAVO_COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: BRAVO_COLORS.border, paddingHorizontal: 14, height: 48, fontSize: 15, color: BRAVO_COLORS.text },
  textArea: { height: 100, paddingTop: 14 },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownOpen: { borderColor: BRAVO_COLORS.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownLeft: { flex: 1 },
  dropdownName: { fontSize: 15, fontWeight: '600', color: BRAVO_COLORS.text },
  dropdownRole: { fontSize: 11, color: BRAVO_COLORS.textMuted, marginTop: 2 },
  dropdownPlaceholder: { fontSize: 15, color: BRAVO_COLORS.textLight },
  dropdownList: { backgroundColor: BRAVO_COLORS.surface, borderWidth: 1, borderTopWidth: 0, borderColor: BRAVO_COLORS.primary, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: BRAVO_COLORS.border },
  dropdownItemActive: { backgroundColor: BRAVO_COLORS.primaryLight },
  dropdownItemAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: BRAVO_COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  dropdownItemInitial: { fontSize: 13, fontWeight: '700', color: '#fff' },
  dropdownItemInfo: { flex: 1 },
  dropdownItemName: { fontSize: 14, fontWeight: '600', color: BRAVO_COLORS.text },
  dropdownItemNameActive: { color: BRAVO_COLORS.primaryDark },
  dropdownItemRole: { fontSize: 11, color: BRAVO_COLORS.textMuted, marginTop: 2 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BRAVO_COLORS.primary, borderRadius: 14, height: 52, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
