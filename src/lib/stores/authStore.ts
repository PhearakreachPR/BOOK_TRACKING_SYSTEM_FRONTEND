import { writable } from 'svelte/store';
import authService from '../services/authService';

interface User {
  id?: number;
  email?: string;
  role?: string;
  isEmailConfirmed?: boolean;
  [key: string]: any; // keep flexible so we don't break anything
}

interface AuthState {
  user: User | null;
  token?: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  needsEmailVerification?: boolean;
}

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface RegisterResult {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
  error?: string;
}

/* ---------- Store ---------- */

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  return {
    subscribe,

    // Initialize auth state
    async init(): Promise<void> {
      update((state) => ({ ...state, isLoading: true }));

      const result = await authService.getCurrentUser();

      if (result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    },

    // Login
    async login(
      email: string,
      password: string,
      rememberMe: boolean = false
    ): Promise<{ success: boolean; error?: string }> {
      update((state) => ({ ...state, isLoading: true, error: null }));

      const result: LoginResult = await authService.login(
        email,
        password,
        rememberMe
      );

      if (result.success) {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        set({
          user: result.user ?? null,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        update((state) => ({
          ...state,
          isLoading: false,
          error: result.error ?? null,
        }));

        return { success: false, error: result.error };
      }
    },

    // Register
    async register(
      userData: Record<string, any>
    ): Promise<{ success: boolean; data?: any; error?: string; needsEmailVerification?: boolean }> {
      update((state) => ({ ...state, isLoading: true, error: null }));

      const result: RegisterResult = await authService.register(userData);

      if (result.success && result.data?.user && result.data?.accessToken) {
        const needsEmailVerification = !result.data.user.isEmailConfirmed;

        set({
          user: result.data.user,
          token: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          needsEmailVerification,
        });

        return {
          success: true,
          data: result.data,
          needsEmailVerification,
        };
      } else {
        update((state) => ({
          ...state,
          isLoading: false,
          error: result.error ?? null,
        }));

        return { success: false, error: result.error };
      }
    },

    // Logout
    async logout(): Promise<void> {
      await authService.logout();

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    },

    // Set token (for refresh)
    setToken(newToken: string): void {
      localStorage.setItem('accessToken', newToken);

      update((state) => ({
        ...state,
        token: newToken,
      }));
    },

    // Update user data
    updateUser(userData: Partial<User>): void {
      update((state) => ({
        ...state,
        user: state.user ? { ...state.user, ...userData } : state.user,
      }));
    },

    // Clear error
    clearError(): void {
      update((state) => ({ ...state, error: null }));
    },
  };
}

export const authStore = createAuthStore();
