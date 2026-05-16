import { Redirect } from 'expo-router';
import { TaskDetailScreen } from '@/features/tasks/screens/task-detail-screen';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function StoreTaskDetailRoute() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  if (!isAuthenticated) {
    return <Redirect href="/store/login" />;
  }

  return <TaskDetailScreen />;
}
