import type { BravoUser } from './types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '@/lib/storage';
import { createSelectors } from '@/lib/utils';
import { findUserByEmployeeId } from './data/mock-data';

type BravoSessionState = {
  user: BravoUser | null;
  isAuthenticated: boolean;
  login: (employeeId: string) => { success: boolean; error?: string };
  logout: () => void;
};

const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

const _useBravoSession = create<BravoSessionState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      login: (employeeId) => {
        const user = findUserByEmployeeId(employeeId);
        if (!user) {
          return {
            success: false,
            error: 'İşçi ID tapılmadı. 1001–1017 arasında bir ID sınayın.',
          };
        }
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'bravo-session',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useBravoSession = createSelectors(_useBravoSession);
