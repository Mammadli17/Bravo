import type { BravoUser, TaskItem } from '../types';

export function filterDashboardTasks(tasks: TaskItem[], user: BravoUser): TaskItem[] {
  return tasks
    .filter(t => t.storeId === user.storeId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
