import type { ActivityLog, TaskItem, TaskPriority, TaskType } from './types';
import { create } from 'zustand';
import { createSelectors } from '@/lib/utils';
import {
  INITIAL_ACTIVITY,
  INITIAL_TASKS,
  LEADERBOARD_DATA,
} from './data/mock-data';
import { calculateEarnedPoints } from './lib/points';
import {
  appendActivity,
  buildClaimedTask,
  buildCompletedTask,
  buildCreateActivity,
  buildNewTask,
  canClaimTask,
  canCompleteTask,
} from './lib/task-store-actions';

export type CreateTaskInput = {
  title: string;
  description: string;
  deadline: string;
  type: TaskType;
  priority: TaskPriority;
  points: number;
  createdById: string;
  storeId: string;
  assignedToId?: string;
  isGeneralPool: boolean;
  beforeImageUrl?: string;
  category: string;
  categoryAz: string;
  location?: string;
};

type ClaimPayload = { taskId: string; userId: string; userName: string };

type CompletePayload = ClaimPayload & {
  afterImageUrl: string;
  closingNote: string;
};

type StatusPayload = ClaimPayload & { status: TaskItem['status'] };

type TaskStoreState = {
  tasks: TaskItem[];
  activity: ActivityLog[];
  leaderboard: typeof LEADERBOARD_DATA;
  claimTask: (payload: ClaimPayload) => boolean;
  completeTask: (payload: CompletePayload) => {
    success: boolean;
    pointsEarned?: number;
  };
  createTask: (input: CreateTaskInput) => TaskItem;
  updateTaskStatus: (payload: StatusPayload) => void;
  getTaskById: (id: string) => TaskItem | undefined;
  getActivityForTask: (taskId: string) => ActivityLog[];
};

const _useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: INITIAL_TASKS,
  activity: INITIAL_ACTIVITY,
  leaderboard: LEADERBOARD_DATA,

  getTaskById: id => get().tasks.find(t => t.id === id),

  getActivityForTask: taskId =>
    get().activity.filter(a => a.taskId === taskId),

  claimTask: ({ taskId, userId, userName }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || !canClaimTask(task, userId))
      return false;

    const updated = buildClaimedTask(task, userId);
    set(state => ({
      tasks: state.tasks.map(t => (t.id === taskId ? updated : t)),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: 'Claimed task',
        actionAz: 'Tapşırığı götürdü',
        timestamp: new Date().toISOString(),
      }),
    }));
    return true;
  },

  completeTask: ({ taskId, userId, userName, afterImageUrl, closingNote }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || !canCompleteTask(task, userId))
      return { success: false };

    const updated = buildCompletedTask(task, afterImageUrl, closingNote);
    const { total } = calculateEarnedPoints(updated);
    const completedAt = updated.completedAt!;

    set(state => ({
      tasks: state.tasks.map(t => (t.id === taskId ? updated : t)),
      leaderboard: state.leaderboard.map(entry =>
        entry.userId === userId
          ? {
              ...entry,
              weeklyPoints: entry.weeklyPoints + total,
              monthlyPoints: entry.monthlyPoints + total,
              tasksCompleted: entry.tasksCompleted + 1,
            }
          : entry,
      ),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: `Completed task (+${total} pts)`,
        actionAz: `Tapşırıq tamamlandı (+${total} xal)`,
        timestamp: completedAt,
      }),
    }));

    return { success: true, pointsEarned: total };
  },

  createTask: (input) => {
    const task = buildNewTask(input);
    set(state => ({
      tasks: [task, ...state.tasks],
      activity: appendActivity(
        state.activity,
        buildCreateActivity(task, input),
      ),
    }));
    return task;
  },

  updateTaskStatus: ({ taskId, status, userId, userName }) => {
    set(state => ({
      tasks: state.tasks.map(t => (t.id === taskId ? { ...t, status } : t)),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: `Status changed to ${status}`,
        actionAz: `Status: ${status}`,
        timestamp: new Date().toISOString(),
      }),
    }));
  },
}));

export const useTaskStore = createSelectors(_useTaskStore);
