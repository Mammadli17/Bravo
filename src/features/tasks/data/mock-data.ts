import type {
  ActivityLog,
  Badge,
  BravoUser,
  HierarchyNode,
  LeaderboardEntry,
  StoreLocation,
  TaskItem,
} from '../types';

export const STORES: StoreLocation[] = [
  {
    id: 'store-001',
    name: 'Bravo 28 May',
    address: '28 May küçəsi 15',
    city: 'Bakı',
    region: 'Abşeron',
  },
  {
    id: 'store-002',
    name: 'Bravo Gənclik',
    address: 'F. Xoyski pr. 14',
    city: 'Bakı',
    region: 'Abşeron',
  },
];

export const MOCK_USERS: BravoUser[] = [
  {
    id: 'user-1001',
    employeeId: '1001',
    name: 'Rəşad Məmmədov',
    nameAz: 'Rəşad Məmmədov',
    role: 'store_manager',
    roleLabel: 'Store Manager',
    roleLabelAz: 'Mağaza Müdiri',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    department: 'Management',
    avatarUrl: 'https://i.pravatar.cc/150?u=1001',
    rank: 3,
    canAssignTasks: true,
    canCreateITTicket: true,
    reportsTo: 'user-1000',
  },
  {
    id: 'user-1002',
    employeeId: '1002',
    name: 'Leyla Həsənova',
    nameAz: 'Leyla Həsənova',
    role: 'cashier',
    roleLabel: 'Cashier / Floor Staff',
    roleLabelAz: 'Xəzinədar / Satıcı-Məsləhətçi',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    department: 'Sales Floor',
    avatarUrl: 'https://i.pravatar.cc/150?u=1002',
    rank: 5,
    canAssignTasks: false,
    canCreateITTicket: true,
    reportsTo: 'user-1001',
  },
  {
    id: 'user-1003',
    employeeId: '1003',
    name: 'Orxan Əliyev',
    nameAz: 'Orxan Əliyev',
    role: 'it_support',
    roleLabel: 'IT Support Specialist',
    roleLabelAz: 'Regional IT Dəstək',
    storeId: 'store-001',
    storeName: 'Regional IT',
    department: 'Information Technology',
    avatarUrl: 'https://i.pravatar.cc/150?u=1003',
    rank: 4,
    canAssignTasks: false,
    canCreateITTicket: false,
    reportsTo: 'user-1000',
  },
  {
    id: 'user-1004',
    employeeId: '1004',
    name: 'Günel Quliyeva',
    nameAz: 'Günel Quliyeva',
    role: 'floor_staff',
    roleLabel: 'Floor Staff',
    roleLabelAz: 'Satış Zalı İşçisi',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    department: 'Grocery',
    avatarUrl: 'https://i.pravatar.cc/150?u=1004',
    rank: 5,
    canAssignTasks: false,
    canCreateITTicket: true,
    reportsTo: 'user-1001',
  },
  {
    id: 'user-1005',
    employeeId: '1005',
    name: 'Elçin Rəhimov',
    nameAz: 'Elçin Rəhimov',
    role: 'department_head',
    roleLabel: 'Department Head',
    roleLabelAz: 'Şöbə Rəhbəri',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    department: 'Fresh Produce',
    avatarUrl: 'https://i.pravatar.cc/150?u=1005',
    rank: 4,
    canAssignTasks: true,
    canCreateITTicket: true,
    reportsTo: 'user-1001',
  },
  {
    id: 'user-1000',
    employeeId: '1000',
    name: 'Kamran İbrahimov',
    nameAz: 'Kamran İbrahimov',
    role: 'regional_manager',
    roleLabel: 'Regional Manager',
    roleLabelAz: 'Regional Menecer',
    storeId: 'store-001',
    storeName: 'Bravo Abşeron Region',
    department: 'Regional Operations',
    avatarUrl: 'https://i.pravatar.cc/150?u=1000',
    rank: 2,
    canAssignTasks: true,
    canCreateITTicket: true,
  },
];

export const ORG_HIERARCHY: HierarchyNode = {
  id: 'node-root',
  userId: 'user-1000',
  title: 'Regional Manager',
  titleAz: 'Regional Menecer',
  level: 1,
  children: [
    {
      id: 'node-sm',
      userId: 'user-1001',
      title: 'Store Manager',
      titleAz: 'Mağaza Müdiri',
      level: 2,
      children: [
        {
          id: 'node-dh',
          userId: 'user-1005',
          title: 'Department Head',
          titleAz: 'Şöbə Rəhbəri',
          level: 3,
          children: [
            {
              id: 'node-fs1',
              userId: 'user-1002',
              title: 'Cashier / Floor Staff',
              titleAz: 'Xəzinədar / Satıcı',
              level: 4,
            },
            {
              id: 'node-fs2',
              userId: 'user-1004',
              title: 'Floor Staff',
              titleAz: 'Satış Zalı İşçisi',
              level: 4,
            },
          ],
        },
      ],
    },
    {
      id: 'node-it',
      userId: 'user-1003',
      title: 'IT Support (Regional)',
      titleAz: 'Regional IT Dəstək',
      level: 2,
    },
  ],
};

const shelfBefore
  = 'https://placehold.co/600x400/E8F5EE/008A4B?text=R%C9%9F+Əvv%C9%99l';
const posBefore
  = 'https://placehold.co/600x400/FEE2E2/DC2626?text=POS+Problem';
const dairyBefore
  = 'https://placehold.co/600x400/FEF3C7/D97706?text=Süd+B%C3%B6lm%C9%99si';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-001',
    type: 'operational',
    title: 'Rəf Düzəlişi – Snack Bölməsi',
    description:
      'Aisle 7 snack bölməsində rəflər qarışıqdır. Planograma uyğun düzəldilməlidir.',
    status: 'open_pool',
    priority: 'medium',
    points: 25,
    speedBonus: 10,
    createdAt: '2026-05-14T08:00:00Z',
    deadline: '2026-05-16T18:00:00Z',
    storeId: 'store-001',
    createdById: 'user-1001',
    beforeImageUrl: shelfBefore,
    category: 'Shelf Arrangement',
    categoryAz: 'Rəf Düzəlişi',
    location: 'Aisle 7',
  },
  {
    id: 'task-002',
    type: 'operational',
    title: 'Soyuducu Etiket Yeniləməsi',
    description: 'Dairy bölməsində 12 ədəd qiymət etiketi sökülüb və ya səhvdir.',
    status: 'in_progress',
    priority: 'high',
    points: 30,
    speedBonus: 15,
    createdAt: '2026-05-13T10:30:00Z',
    deadline: '2026-05-15T20:00:00Z',
    storeId: 'store-001',
    createdById: 'user-1005',
    assignedToId: 'user-1004',
    claimedById: 'user-1004',
    beforeImageUrl: dairyBefore,
    category: 'Labeling',
    categoryAz: 'Etiketləmə',
    location: 'Dairy Section',
  },
  {
    id: 'task-003',
    type: 'it_ticket',
    title: 'POS Terminal #3 Cavab Vermir',
    description:
      'Kassa 3 POS terminalı açılmır. Ekran qara qalır, restart kömək etmir.',
    status: 'claimed',
    priority: 'urgent',
    points: 50,
    speedBonus: 20,
    createdAt: '2026-05-15T07:15:00Z',
    deadline: '2026-05-15T14:00:00Z',
    storeId: 'store-001',
    createdById: 'user-1002',
    assignedToId: 'user-1003',
    claimedById: 'user-1003',
    beforeImageUrl: posBefore,
    category: 'POS / Hardware',
    categoryAz: 'POS / Avadanlıq',
    location: 'Checkout 3',
  },
  {
    id: 'task-004',
    type: 'operational',
    title: 'Giriş Zonası Təmizliyi',
    description: 'Mağaza girişində reklam stendi və döşəmə təmizlənməlidir.',
    status: 'done',
    priority: 'low',
    points: 15,
    speedBonus: 5,
    createdAt: '2026-05-10T09:00:00Z',
    deadline: '2026-05-12T17:00:00Z',
    completedAt: '2026-05-11T15:30:00Z',
    storeId: 'store-001',
    createdById: 'user-1001',
    assignedToId: 'user-1002',
    claimedById: 'user-1002',
    beforeImageUrl:
      'https://placehold.co/600x400/F5F7FA/64748B?text=Giriş+Əvvəl',
    afterImageUrl:
      'https://placehold.co/600x400/008A4B/FFFFFF?text=Təmiz+Giriş',
    closingNote: 'Stendi və döşəmə təmizləndi, müştəri girişi açıqdır.',
    category: 'Cleaning',
    categoryAz: 'Təmizlik',
    location: 'Main Entrance',
  },
  {
    id: 'task-005',
    type: 'operational',
    title: 'Meyvə-Tərəvəz Rəf Yeniləməsi',
    description: 'Fresh produce rəfində çürük məhsul var, rəf yenilənməlidir.',
    status: 'pending',
    priority: 'high',
    points: 35,
    speedBonus: 12,
    createdAt: '2026-05-15T11:00:00Z',
    deadline: '2026-05-16T12:00:00Z',
    storeId: 'store-001',
    createdById: 'user-1001',
    assignedToId: 'user-1005',
    beforeImageUrl:
      'https://placehold.co/600x400/DCFCE7/166534?text=Tərəvəz+Rəf',
    category: 'Fresh Produce',
    categoryAz: 'Təzə Məhsul',
    location: 'Produce Aisle',
  },
  {
    id: 'task-006',
    type: 'it_ticket',
    title: 'Wi-Fi Kassa Zonasında Zəif',
    description: 'Kassa zonasında Wi-Fi siqnalı zəifdir, mobil skaner işləmir.',
    status: 'open_pool',
    priority: 'medium',
    points: 40,
    speedBonus: 15,
    createdAt: '2026-05-15T13:45:00Z',
    deadline: '2026-05-17T18:00:00Z',
    storeId: 'store-001',
    createdById: 'user-1001',
    beforeImageUrl:
      'https://placehold.co/600x400/E0E7FF/3730A3?text=Wi-Fi+Siqnal',
    category: 'Network',
    categoryAz: 'Şəbəkə',
    location: 'Checkout Zone',
  },
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'act-001',
    taskId: 'task-001',
    userId: 'user-1001',
    userName: 'Rəşad Məmmədov',
    action: 'Created task and added to General Pool',
    actionAz: 'Tapşırıq yaradıldı və Ümumi Hovuza əlavə edildi',
    timestamp: '2026-05-14T08:00:00Z',
  },
  {
    id: 'act-002',
    taskId: 'task-002',
    userId: 'user-1004',
    userName: 'Günel Quliyeva',
    action: 'Claimed task',
    actionAz: 'Tapşırığı götürdü',
    timestamp: '2026-05-13T11:00:00Z',
  },
  {
    id: 'act-003',
    taskId: 'task-003',
    userId: 'user-1003',
    userName: 'Orxan Əliyev',
    action: 'IT ticket assigned and in progress',
    actionAz: 'IT biletini qəbul etdi və işləyir',
    timestamp: '2026-05-15T08:00:00Z',
  },
  {
    id: 'act-004',
    taskId: 'task-004',
    userId: 'user-1002',
    userName: 'Leyla Həsənova',
    action: 'Completed with after photo',
    actionAz: 'Son şəkil ilə tamamlandı',
    timestamp: '2026-05-11T15:30:00Z',
  },
];

const SHARED_BADGES: Badge[] = [
  {
    id: 'badge-speed',
    label: 'Speed Solver',
    labelAz: 'Sürətli Həll',
    icon: 'flash',
    earnedAt: '2026-05-01',
  },
  {
    id: 'badge-shelf',
    label: 'Perfect Shelf',
    labelAz: 'Qüsursuz Rəf',
    icon: 'grid',
    earnedAt: '2026-05-08',
  },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    userId: 'user-1002',
    employeeId: '1002',
    name: 'Leyla Həsənova',
    nameAz: 'Leyla Həsənova',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    weeklyPoints: 145,
    monthlyPoints: 520,
    tasksCompleted: 18,
    onTimeRate: 94,
    badges: SHARED_BADGES,
    rank: 1,
  },
  {
    userId: 'user-1004',
    employeeId: '1004',
    name: 'Günel Quliyeva',
    nameAz: 'Günel Quliyeva',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    weeklyPoints: 128,
    monthlyPoints: 485,
    tasksCompleted: 15,
    onTimeRate: 88,
    badges: [SHARED_BADGES[1]!],
    rank: 2,
  },
  {
    userId: 'user-1005',
    employeeId: '1005',
    name: 'Elçin Rəhimov',
    nameAz: 'Elçin Rəhimov',
    storeId: 'store-001',
    storeName: 'Bravo 28 May',
    weeklyPoints: 95,
    monthlyPoints: 410,
    tasksCompleted: 12,
    onTimeRate: 91,
    badges: [],
    rank: 3,
  },
  {
    userId: 'user-1003',
    employeeId: '1003',
    name: 'Orxan Əliyev',
    nameAz: 'Orxan Əliyev',
    storeId: 'store-001',
    storeName: 'Regional IT',
    weeklyPoints: 180,
    monthlyPoints: 620,
    tasksCompleted: 22,
    onTimeRate: 96,
    badges: [
      {
        id: 'badge-it-hero',
        label: 'IT Hero',
        labelAz: 'IT Qəhrəmanı',
        icon: 'hardware-chip',
        earnedAt: '2026-05-10',
      },
    ],
    rank: 1,
  },
  {
    userId: 'user-1001',
    employeeId: '1001',
    name: 'Rəşad Məmmədov',
    nameAz: 'Rəşad Məmmədov',
    storeId: 'store-002',
    storeName: 'Bravo Gənclik',
    weeklyPoints: 60,
    monthlyPoints: 220,
    tasksCompleted: 5,
    onTimeRate: 100,
    badges: [],
    rank: 4,
  },
];

export function findUserByEmployeeId(employeeId: string): BravoUser | undefined {
  return MOCK_USERS.find(u => u.employeeId === employeeId.trim());
}

export function getUserById(userId: string): BravoUser | undefined {
  return MOCK_USERS.find(u => u.id === userId);
}

export function getAssignableUsers(
  creator: BravoUser,
): BravoUser[] {
  const sameStore = MOCK_USERS.filter(
    u =>
      u.storeId === creator.storeId
      && u.id !== creator.id
      && u.role !== 'it_support'
      && u.role !== 'regional_manager',
  );

  if (creator.role === 'store_manager' || creator.role === 'regional_manager') {
    return sameStore.filter(u => u.rank >= creator.rank);
  }

  if (creator.role === 'department_head') {
    return sameStore.filter(
      u =>
        u.rank >= creator.rank
        || u.reportsTo === creator.id,
    );
  }

  return [];
}

export const DEMO_HINTS = [
  { id: '1001', label: 'Mağaza Müdiri' },
  { id: '1002', label: 'Xəzinədar' },
  { id: '1003', label: 'IT Dəstək' },
] as const;
