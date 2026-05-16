import { Redirect } from 'expo-router';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function BravoTab() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  return <Redirect href={isAuthenticated ? '/store' : '/store/login'} />;
}
