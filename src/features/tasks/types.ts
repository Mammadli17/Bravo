export type UserRole
  = | 'regional_manager'
    | 'store_manager'
    | 'department_head'
    | 'floor_staff'
    | 'cashier'
    | 'it_support';

export type TaskStatus
  = | 'pending'
    | 'open_pool'
    | 'claimed'
    | 'in_progress'
    | 'done'
    | 'cancelled';

export type TaskType = 'operational' | 'it_ticket';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type BravoUser = {
  id: string;
  employeeId: string;
  name: string;
  nameAz: string;
  role: UserRole;
  roleLabel: string;
  roleLabelAz: string;
  storeId: string;
  storeName: string;
  department?: string;
  avatarUrl: string;
  rank: number;
  canAssignTasks: boolean;
  canCreateITTicket: boolean;
  reportsTo?: string;
};

export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
};

export type HierarchyNode = {
  id: string;
  userId: string;
  title: string;
  titleAz: string;
  level: number;
  children?: HierarchyNode[];
};

export type TaskItem = {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  points: number;
  speedBonus: number;
  createdAt: string;
  deadline: string;
  completedAt?: string;
  storeId: string;
  createdById: string;
  assignedToId?: string;
  claimedById?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  closingNote?: string;
  category: string;
  categoryAz: string;
  location?: string;
};

export type LeaderboardEntry = {
  userId: string;
  employeeId: string;
  name: string;
  nameAz: string;
  storeId: string;
  storeName: string;
  weeklyPoints: number;
  monthlyPoints: number;
  tasksCompleted: number;
  onTimeRate: number;
  badges: Badge[];
  rank: number;
};

export type Badge = {
  id: string;
  label: string;
  labelAz: string;
  icon: string;
  earnedAt: string;
};

export type PerformanceStats = {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  tasksCompleted: number;
  onTimeCompletions: number;
  lateCompletions: number;
  averageCompletionHours: number;
};

export type DashboardFilter = 'all' | 'pool' | 'mine' | 'it' | 'done';

export type ActivityLog = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  actionAz: string;
  timestamp: string;
};
