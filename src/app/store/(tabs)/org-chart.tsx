import { Redirect } from 'expo-router';
import { OrgChartScreen } from '@/features/tasks/screens/org-chart-screen';
import { useBravoSession } from '@/features/tasks/use-bravo-session';

export default function StoreOrgChartRoute() {
  const isAuthenticated = useBravoSession.use.isAuthenticated();

  if (!isAuthenticated) {
    return <Redirect href="/store/login" />;
  }

  return <OrgChartScreen />;
}
