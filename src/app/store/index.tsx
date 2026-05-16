import { Redirect } from 'expo-router';
import { DashboardScreen } from '@/features/tasks/screens/dashboard-screen';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function StoreDashboardRoute() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  if (!isAuthenticated) {
    return <Redirect href="/store/login" />;
  }

  return <DashboardScreen />;
}
