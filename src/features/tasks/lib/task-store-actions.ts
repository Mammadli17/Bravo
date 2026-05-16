import type { ActivityLog, TaskItem } from '../types';
import type { CreateTaskInput } from '../use-task-store';

export function generateTaskId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function appendActivity(
  activity: ActivityLog[],
  entry: Omit<ActivityLog, 'id'>,
): ActivityLog[] {
  return [{ ...entry, id: generateTaskId('act') }, ...activity];
}

export function buildClaimedTask(task: TaskItem, userId: string): TaskItem {
  return {
    ...task,
    status: 'in_progress',
    claimedById: userId,
    assignedToId: task.assignedToId ?? userId,
  };
}

export function canClaimTask(task: TaskItem, userId: string): boolean {
  const claimableStatuses: TaskItem['status'][] = [
    'open_pool',
    'pending',
    'claimed',
  ];
  if (!claimableStatuses.includes(task.status))
    return false;
  if (task.claimedById && task.claimedById !== userId)
    return false;
  return task.status !== 'done' && task.status !== 'cancelled';
}

export function buildCompletedTask(
  task: TaskItem,
  afterImageUrl: string,
  closingNote: string,
): TaskItem {
  return {
    ...task,
    status: 'done',
    afterImageUrl,
    closingNote,
    completedAt: new Date().toISOString(),
  };
}

export function canCompleteTask(task: TaskItem, userId: string): boolean {
  return (
    task.claimedById === userId
    || task.assignedToId === userId
    || task.type === 'it_ticket'
  );
}

export function buildNewTask(input: CreateTaskInput): TaskItem {
  const status = input.isGeneralPool
    ? 'open_pool'
    : input.assignedToId
      ? 'pending'
      : 'open_pool';

  return {
    id: generateTaskId('task'),
    type: input.type,
    title: input.title,
    description: input.description,
    status,
    priority: input.priority,
    points: input.points,
    speedBonus: Math.round(input.points * 0.4),
    createdAt: new Date().toISOString(),
    deadline: input.deadline,
    storeId: input.storeId,
    createdById: input.createdById,
    assignedToId: input.isGeneralPool ? undefined : input.assignedToId,
    beforeImageUrl: input.beforeImageUrl,
    category: input.category,
    categoryAz: input.categoryAz,
    location: input.location,
  };
}

export function buildCreateActivity(
  task: TaskItem,
  input: CreateTaskInput,
): Omit<ActivityLog, 'id'> {
  return {
    taskId: task.id,
    userId: input.createdById,
    userName: 'System',
    action: input.isGeneralPool
      ? 'Created and added to General Pool'
      : 'Created and assigned task',
    actionAz: input.isGeneralPool
      ? 'Yaradıldı və Ümumi Hovuza əlavə edildi'
      : 'Yaradıldı və təyin edildi',
    timestamp: task.createdAt,
  };
}
