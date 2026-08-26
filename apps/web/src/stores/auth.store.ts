import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

// Demo users for live testing without backend
const DEMO_USERS: Record<string, User> = {
  'officer@amot.gov.ng': {
    id: '1', email: 'officer@amot.gov.ng',
    firstName: 'John', lastName: 'Okafor', role: 'FIELD_OFFICER'
  },
  'team@amot.gov.ng': {
    id: '2', email: 'team@amot.gov.ng',
    firstName: 'Amina', lastName: 'Ibrahim', role: 'ADVERT_TEAM'
  },
  'supervisor@amot.gov.ng': {
    id: '3', email: 'supervisor@amot.gov.ng',
    firstName: 'Chukwuma', lastName: 'Eze', role: 'SUPERVISOR'
  },
  'admin@amot.gov.ng': {
    id: '4', email: 'admin@amot.gov.ng',
    firstName: 'Ngozi', lastName: 'Adeyemi', role: 'ADMINISTRATOR'
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, _password: string) => {
        // Try real API first, fall back to demo mode
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: _password }),
          });
          if (res.ok) {
            const { user, token } = await res.json();
            set({ user, token, isAuthenticated: true });
            return;
          }
        } catch {
          // Backend not available - use demo mode
        }

        // Demo mode fallback
        const demoUser = DEMO_USERS[email.toLowerCase()];
        if (demoUser) {
          set({ user: demoUser, token: 'demo-token', isAuthenticated: true });
          return;
        }
        throw new Error('Invalid credentials. Demo accounts: officer@amot.gov.ng, team@amot.gov.ng, supervisor@amot.gov.ng, admin@amot.gov.ng');
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      hasRole: (roles: string[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      }
    }),
    {
      name: 'amot-auth',
    }
  )
);
