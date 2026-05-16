import { Redirect } from 'expo-router';
import { CreateTaskScreen } from '@/features/tasks/screens/create-task-screen';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function StoreCreateRoute() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  if (!isAuthenticated) {
    return <Redirect href="/store/login" />;
  }

  return <CreateTaskScreen />;
}
