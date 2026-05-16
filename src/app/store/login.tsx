import { Redirect } from 'expo-router';
import { BravoLoginScreen } from '@/features/tasks/screens/login-screen';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function StoreLoginRoute() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  if (isAuthenticated) {
    return <Redirect href="/store" />;
  }

  return <BravoLoginScreen />;
}
