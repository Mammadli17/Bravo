import { Redirect } from 'expo-router';
import { LeaderboardScreen } from '@/features/tasks/screens/leaderboard-screen';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function StoreLeaderboardRoute() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  if (!isAuthenticated) {
    return <Redirect href="/store/login" />;
  }

  return <LeaderboardScreen />;
}
