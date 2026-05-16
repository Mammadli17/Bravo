import type { ActivityLog, TaskItem } from '../types';
import type { CreateTaskInput } from '../use-task-store';

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function appendActivity(
  activity: ActivityLog[],
  entry: Omit<ActivityLog, 'id'>,
): ActivityLog[] {
  return [{ ...entry, id: generateId('act') }, ...activity];
}

export function buildNewTask(input: CreateTaskInput): TaskItem {
  return {
    id: generateId('task'),
    title: input.title,
    description: input.description,
    status: 'assigned',
    priority: input.priority,
    points: input.points,
    speedBonus: Math.round(input.points * 0.4),
    createdAt: new Date().toISOString(),
    deadline: input.deadline,
    storeId: input.storeId,
    sectionId: input.sectionId,
    createdById: input.createdById,
    assignedToId: input.assignedToId,
    forwardChain: [input.createdById],
    beforeImageUrl: input.beforeImageUrl,
    category: input.category,
    categoryAz: input.categoryAz,
  };
}

export function canForwardTask(task: TaskItem, userId: string): boolean {
  return (
    task.assignedToId === userId
    && (task.status === 'assigned' || task.status === 'in_progress')
  );
}

export function canStartTask(task: TaskItem, userId: string): boolean {
  return task.assignedToId === userId && task.status === 'assigned';
}

export function canCompleteTask(task: TaskItem, userId: string): boolean {
  return task.assignedToId === userId && task.status === 'in_progress';
}

export function canApproveTask(task: TaskItem, userId: string): boolean {
  return task.assignedToId === userId && task.status === 'waiting_approval';
}
