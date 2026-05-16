import type { TaskItem } from '../types';

export function calculateEarnedPoints(task: TaskItem): {
  base: number;
  bonus: number;
  penalty: number;
  total: number;
} {
  if (!task.completedAt) {
    return { base: 0, bonus: 0, penalty: 0, total: 0 };
  }

  const completed = new Date(task.completedAt).getTime();
  const deadline = new Date(task.deadline).getTime();
  const base = task.points;

  if (completed <= deadline) {
    const hoursEarly = (deadline - completed) / (1000 * 60 * 60);
    const bonusMultiplier = Math.min(hoursEarly / 24, 1);
    const bonus = Math.round(task.speedBonus * bonusMultiplier);
    return { base, bonus, penalty: 0, total: base + bonus };
  }

  const hoursLate = (completed - deadline) / (1000 * 60 * 60);
  const penalty = Math.min(Math.round(hoursLate * 2), Math.floor(base * 0.5));
  return { base, bonus: 0, penalty, total: Math.max(base - penalty, 1) };
}

export function formatDeadline(deadline: string): string {
  const d = new Date(deadline);
  return d.toLocaleDateString('az-AZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOverdue(task: TaskItem): boolean {
  if (task.status === 'completed' || task.status === 'cancelled') return false;
  return new Date(task.deadline).getTime() < Date.now();
}
