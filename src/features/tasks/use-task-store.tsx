import type { ActivityLog, SectionType, TaskItem, TaskPriority, TaskStatus } from './types';
import { create } from 'zustand';
import { createSelectors } from '@/lib/utils';
import { INITIAL_ACTIVITY, INITIAL_TASKS, LEADERBOARD_DATA } from './data/mock-data';
import { calculateEarnedPoints } from './lib/points';
import {
  appendActivity,
  buildNewTask,
  canApproveTask,
  canCompleteTask,
  canForwardTask,
  canStartTask,
} from './lib/task-store-actions';

export type CreateTaskInput = {
  title: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  points: number;
  createdById: string;
  storeId: string;
  sectionId?: SectionType;
  assignedToId?: string;
  beforeImageUrl?: string;
  category: string;
  categoryAz: string;
};

type ForwardPayload = {
  taskId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
};

type ActionPayload = {
  taskId: string;
  userId: string;
  userName: string;
};

type CompletePayload = ActionPayload & {
  afterImageUrl: string;
  closingNote: string;
};

type ApprovePayload = ActionPayload & { note?: string };

type TaskStoreState = {
  tasks: TaskItem[];
  activity: ActivityLog[];
  leaderboard: typeof LEADERBOARD_DATA;

  getTaskById: (id: string) => TaskItem | undefined;
  getActivityForTask: (taskId: string) => ActivityLog[];
  createTask: (input: CreateTaskInput) => TaskItem;
  forwardTask: (payload: ForwardPayload) => boolean;
  startTask: (payload: ActionPayload) => boolean;
  completeTask: (payload: CompletePayload) => { success: boolean; pointsEarned?: number };
  approveTask: (payload: ApprovePayload) => void;
  rejectTask: (payload: ApprovePayload) => void;
  requestRework: (payload: ApprovePayload) => void;
  updateTaskStatus: (payload: ActionPayload & { status: TaskStatus }) => void;
};

const _useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: INITIAL_TASKS,
  activity: INITIAL_ACTIVITY,
  leaderboard: LEADERBOARD_DATA,

  getTaskById: id => get().tasks.find(t => t.id === id),

  getActivityForTask: taskId => get().activity.filter(a => a.taskId === taskId),

  createTask: (input) => {
    const task = buildNewTask(input);
    set(state => ({
      tasks: [task, ...state.tasks],
      activity: appendActivity(state.activity, {
        taskId: task.id,
        userId: input.createdById,
        userName: 'Sistem',
        action: 'Task created and assigned',
        actionAz: 'Tapşırıq yaradıldı və təyin edildi',
        timestamp: task.createdAt,
      }),
    }));
    return task;
  },

  forwardTask: ({ taskId, fromUserId, fromUserName, toUserId, toUserName }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || !canForwardTask(task, fromUserId)) return false;

    const updated: TaskItem = {
      ...task,
      assignedToId: toUserId,
      forwardChain: [...task.forwardChain, fromUserId],
      status: 'assigned',
    };

    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? updated : t),
      activity: appendActivity(state.activity, {
        taskId,
        userId: fromUserId,
        userName: fromUserName,
        action: `Forwarded to ${toUserName}`,
        actionAz: `${toUserName}-ə yönləndirildi`,
        timestamp: new Date().toISOString(),
      }),
    }));
    return true;
  },

  startTask: ({ taskId, userId, userName }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || !canStartTask(task, userId)) return false;

    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'in_progress' as TaskStatus } : t),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: 'Started working',
        actionAz: 'İşə başladı',
        timestamp: new Date().toISOString(),
      }),
    }));
    return true;
  },

  completeTask: ({ taskId, userId, userName, afterImageUrl, closingNote }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || !canCompleteTask(task, userId)) return { success: false };

    const completedAt = new Date().toISOString();
    const approverUserId = task.forwardChain.at(-1);

    const updated: TaskItem = {
      ...task,
      afterImageUrl,
      closingNote,
      completedAt,
      status: approverUserId ? 'waiting_approval' : 'completed',
      assignedToId: approverUserId ?? task.assignedToId,
      forwardChain: approverUserId
        ? task.forwardChain.slice(0, -1)
        : task.forwardChain,
    };

    const { total } = calculateEarnedPoints({ ...updated, status: 'completed' });

    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? updated : t),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: 'Completed – submitted for approval',
        actionAz: 'Tamamlandı – təsdiq üçün göndərildi',
        timestamp: completedAt,
      }),
    }));

    return { success: true, pointsEarned: total };
  },

  approveTask: ({ taskId, userId, userName, note }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || !canApproveTask(task, userId)) return;

    const nextApprover = task.forwardChain.at(-1);
    const isFullyApproved = !nextApprover;

    const updated: TaskItem = {
      ...task,
      status: isFullyApproved ? 'completed' : 'waiting_approval',
      assignedToId: isFullyApproved ? task.assignedToId : nextApprover,
      forwardChain: isFullyApproved ? [] : task.forwardChain.slice(0, -1),
      completedAt: isFullyApproved ? (task.completedAt ?? new Date().toISOString()) : task.completedAt,
    };

    const { total } = isFullyApproved ? calculateEarnedPoints({ ...updated, status: 'completed' }) : { total: 0 };

    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? updated : t),
      leaderboard: isFullyApproved
        ? state.leaderboard.map(e =>
            e.userId === (task.assignedToId ?? userId)
              ? { ...e, weeklyPoints: e.weeklyPoints + total, monthlyPoints: e.monthlyPoints + total, tasksCompleted: e.tasksCompleted + 1 }
              : e,
          )
        : state.leaderboard,
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: note ? `Approved: ${note}` : 'Approved',
        actionAz: note ? `Təsdiqləndi: ${note}` : 'Təsdiqləndi',
        timestamp: new Date().toISOString(),
      }),
    }));
  },

  rejectTask: ({ taskId, userId, userName, note }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'rejected' as TaskStatus } : t),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: note ? `Rejected: ${note}` : 'Rejected',
        actionAz: note ? `Rədd edildi: ${note}` : 'Rədd edildi',
        timestamp: new Date().toISOString(),
      }),
    }));
  },

  requestRework: ({ taskId, userId, userName, note }) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'rework_requested' as TaskStatus,
              assignedToId: [...t.forwardChain, userId].at(-1),
            }
          : t,
      ),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: note ? `Rework requested: ${note}` : 'Rework requested',
        actionAz: note ? `Yenidən işlənmə tələb edildi: ${note}` : 'Yenidən işlənmə tələb edildi',
        timestamp: new Date().toISOString(),
      }),
    }));
  },

  updateTaskStatus: ({ taskId, status, userId, userName }) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t),
      activity: appendActivity(state.activity, {
        taskId,
        userId,
        userName,
        action: `Status: ${status}`,
        actionAz: `Status: ${status}`,
        timestamp: new Date().toISOString(),
      }),
    }));
  },
}));

export const useTaskStore = createSelectors(_useTaskStore);
