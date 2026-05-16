import type { CreateTaskFormState } from '../components/create-task-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BravoHeader } from '../components/bravo-header';
import { CreateTaskForm } from '../components/create-task-form';
import { BRAVO_COLORS } from '../constants/theme';
import { getAssignableUsers } from '../data/mock-data';
import { getCategoryByIndex } from '../lib/categories';
import { getPriorityPoints } from '../lib/priority-points';
import { useBravoSession } from '../use-bravo-session';
import { useTaskStore } from '../use-task-store';

export function CreateTaskScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useBravoSession.use.user()!;
  const createTask = useTaskStore.use.createTask();

  const canCreateOperational = user.canAssignTasks || user.role === 'department_head';
  const canOnlyIT = !canCreateOperational && user.canCreateITTicket;
  const assignable = React.useMemo(() => getAssignableUsers(user), [user]);

  const [form, setForm] = React.useState<CreateTaskFormState>({
    taskType: canOnlyIT ? 'it_ticket' : 'operational',
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    categoryIndex: 0,
    isGeneralPool: false,
    deadlineDays: 2,
  });

  const patchForm = (patch: Partial<CreateTaskFormState>) =>
    setForm(prev => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      Alert.alert('Diqqət', 'Başlıq və təsvir daxil edin');
      return;
    }

    const category = getCategoryByIndex(form.categoryIndex);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + form.deadlineDays);

    const task = createTask({
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: deadline.toISOString(),
      type: form.taskType,
      priority: form.priority,
      points: getPriorityPoints(form.priority),
      createdById: user.id,
      storeId: user.storeId,
      assignedToId:
        form.taskType === 'it_ticket' ? undefined : form.isGeneralPool ? undefined : form.assigneeId,
      isGeneralPool:
        form.taskType === 'it_ticket'
        || (form.taskType === 'operational' && (form.isGeneralPool || !form.assigneeId)),
      beforeImageUrl: form.beforeImage,
      category: form.taskType === 'it_ticket' ? 'IT Support' : category.en,
      categoryAz: form.taskType === 'it_ticket' ? 'IT Dəstək' : category.az,
      location: form.location.trim() || undefined,
    });

    showMessage({ message: 'Tapşırıq yaradıldı', type: 'success' });
    router.replace(`/store/task/${task.id}`);
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
          assignable={assignable}
          canOnlyIT={canOnlyIT}
          canCreateOperational={canCreateOperational}
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
