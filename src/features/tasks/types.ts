export type UserRole =
  | 'area_manager'
  | 'store_manager'
  | 'store_manager_assistant'
  | 'section_leader'
  | 'senior_seller'
  | 'seller';

export type TaskStatus =
  | 'assigned'
  | 'in_progress'
  | 'waiting_approval'
  | 'completed'
  | 'rejected'
  | 'rework_requested'
  | 'overdue'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type SectionType =
  | 'fruit_vegetables'
  | 'dry_foods'
  | 'beverages'
  | 'cash_desk'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'operations';

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
  sectionId?: SectionType;
  managerId?: string;
  avatarUrl: string;
  rank: number;
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
  sectionId?: SectionType;
  createdById: string;
  assignedToId?: string;
  forwardChain: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  closingNote?: string;
  category: string;
  categoryAz: string;
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

export type ActivityLog = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  actionAz: string;
  timestamp: string;
};
