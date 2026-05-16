import type { CreateTaskFormState } from '../components/create-task-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BravoHeader } from '../components/bravo-header';
import { CreateTaskForm } from '../components/create-task-form';
import { BRAVO_COLORS } from '../constants/theme';
import { getSubordinates, getUserById } from '../data/mock-data';
import { getPriorityPoints } from '../lib/priority-points';
import { getSectionLabel } from '../lib/sections';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

export function CreateTaskScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useBravoSession.use.user()!;
  const createTask = useTaskStore.use.createTask();

  const subordinates = React.useMemo(() => getSubordinates(user.id), [user.id]);

  const [form, setForm] = React.useState<CreateTaskFormState>({
    title: '',
    description: '',
    priority: 'medium',
    deadlineDays: 2,
    deadlineHours: 0,
  });

  const patchForm = (patch: Partial<CreateTaskFormState>) =>
    setForm(prev => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      Alert.alert('Diqqət', 'Başlıq və təsvir daxil edin');
      return;
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + form.deadlineDays);
    if (form.deadlineHours > 0) {
      deadline.setHours(deadline.getHours() + form.deadlineHours);
    }

    const assignee = form.assigneeId ? getUserById(form.assigneeId) : undefined;
    const sectionId = assignee?.sectionId ?? user.sectionId;
    const sectionLabel = getSectionLabel(sectionId);

    createTask({
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: deadline.toISOString(),
      priority: form.priority,
      points: getPriorityPoints(form.priority),
      createdById: user.id,
      storeId: user.storeId,
      sectionId,
      assignedToId: form.assigneeId,
      beforeImageUrl: form.beforeImage,
      category: sectionLabel,
      categoryAz: sectionLabel,
    });

    showMessage({ message: 'Tapşırıq yaradıldı', type: 'success' });
    router.back();
  };

  return (
    <View style={styles.container}>
      <BravoHeader title="Yeni Tapşırıq" showBack />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CreateTaskForm
          subordinates={subordinates}
          state={form}
          onChange={patchForm}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAVO_COLORS.background },
  scroll: { padding: 16 },
});
