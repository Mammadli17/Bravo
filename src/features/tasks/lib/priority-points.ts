import type { TaskPriority } from '../types';

const PRIORITY_POINTS: Record<TaskPriority, number> = {
  low: 15,
  medium: 25,
  high: 40,
  critical: 60,
};

export function getPriorityPoints(priority: TaskPriority): number {
  return PRIORITY_POINTS[priority];
}
