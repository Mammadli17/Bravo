import type { BravoUser, TaskPriority, TaskType } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
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
  location: string;
  priority: TaskPriority;
  categoryIndex: number;
  isGeneralPool: boolean;
  assigneeId?: string;
  beforeImage?: string;
  deadlineDays: number;
};

type Props = {
  assignable: BravoUser[];
  canOnlyIT: boolean;
  canCreateOperational: boolean;
  state: CreateTaskFormState;
  onChange: (patch: Partial<CreateTaskFormState>) => void;
  onSubmit: () => void;
};

export function CreateTaskForm({
  assignable,
  canOnlyIT,
  canCreateOperational,
  state,
  onChange,
  onSubmit,
}: Props) {
  const set = (patch: Partial<CreateTaskFormState>) => onChange(patch);

  return (
    <>
      {!canOnlyIT
        ? (
            <View style={styles.typeRow}>
              <TypeTab label="Operativ" active={state.taskType === 'operational'} onPress={() => set({ taskType: 'operational' })} />
              <TypeTab label="IT Bilet" active={state.taskType === 'it_ticket'} onPress={() => set({ taskType: 'it_ticket' })} />
            </View>
          )
        : null}

      <Field label="Başlıq">
        <TextInput style={styles.input} placeholder="Məs: Rəf düzəlişi" placeholderTextColor={BRAVO_COLORS.textLight} value={state.title} onChangeText={title => set({ title })} />
      </Field>
      <Field label="Təsvir">
        <TextInput style={[styles.input, styles.textArea]} placeholder="Tapşırığın detalları..." placeholderTextColor={BRAVO_COLORS.textLight} value={state.description} onChangeText={description => set({ description })} multiline numberOfLines={4} textAlignVertical="top" />
      </Field>
      <Field label="Yer (opsional)">
        <TextInput style={styles.input} placeholder="Məs: Aisle 7" placeholderTextColor={BRAVO_COLORS.textLight} value={state.location} onChangeText={location => set({ location })} />
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
                      onSelectPool={() => set({ isGeneralPool: true, assigneeId: undefined })}
                      onSelectAssignee={id => set({ assigneeId: id, isGeneralPool: false })}
                    />
                  )
                : null}
            </>
          )
        : (
            <View style={styles.itInfo}>
              <Ionicons name="information-circle" size={20} color="#4338CA" />
              <Text style={styles.itInfoText}>IT bileti Regional IT növbəsinə göndəriləcək</Text>
            </View>
          )}

      <CreateTaskOptions
        priority={state.priority}
        deadlineDays={state.deadlineDays}
        onPriorityChange={priority => set({ priority })}
        onDeadlineChange={deadlineDays => set({ deadlineDays })}
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
  itInfo: { flexDirection: 'row', gap: 10, backgroundColor: '#EEF2FF', padding: 14, borderRadius: 12, marginBottom: 16 },
  itInfoText: { flex: 1, fontSize: 13, color: '#4338CA', lineHeight: 18 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: BRAVO_COLORS.primary, borderRadius: 14, height: 52, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
