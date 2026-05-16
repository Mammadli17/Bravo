import type { BravoUser, DashboardFilter, TaskItem } from '../types';

export function filterDashboardTasks(
  tasks: TaskItem[],
  user: BravoUser,
  filter: DashboardFilter,
): TaskItem[] {
  const isIT = user.role === 'it_support';

  let list = tasks.filter((t) => {
    if (isIT)
      return t.type === 'it_ticket';
    if (t.storeId !== user.storeId && t.type !== 'it_ticket')
      return t.createdById === user.id;
    return true;
  });

  switch (filter) {
    case 'pool':
      list = list.filter(t => t.status === 'open_pool');
      break;
    case 'mine':
      list = list.filter(
        t =>
          t.assignedToId === user.id
          || t.claimedById === user.id
          || t.createdById === user.id,
      );
      break;
    case 'it':
      list = list.filter(t => t.type === 'it_ticket');
      break;
    case 'done':
      list = list.filter(t => t.status === 'done');
      break;
    default:
      break;
  }

  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
