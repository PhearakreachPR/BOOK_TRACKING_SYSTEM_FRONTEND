import { writable } from 'svelte/store';
import authService from '../services/authService';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  return {
    subscribe,

    // Initialize auth state
    async init() {
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
    async login(email, password, rememberMe = false) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      
      const result = await authService.login(email, password, rememberMe);
      
      if (result.success) {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        set({
          user: result.user,
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
          error: result.error,
        }));
        return { success: false, error: result.error };
      }
    },

    // Register
    async register(userData) {
      update((state) => ({ ...state, isLoading: true, error: null }));
      
      const result = await authService.register(userData);
      
      if (result.success && result.data?.user && result.data?.accessToken) {
        // After registration, you might want to auto-login or redirect
          set({
            user: result.data.user,
            token: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            needsEmailVerification: !result.data.user.isEmailConfirmed,
          });
        return { success: true, data: result.data, needsEmailVerification: !result.data.user.isEmailConfirmed };
      } else {
        update((state) => ({
          ...state,
          isLoading: false,
          error: result.error,
        }));
        return { success: false, error: result.error };
      }
    },

    // Logout
    async logout() {
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
    setToken(newToken) {
      localStorage.setItem('accessToken', newToken);
      update((state) => ({
        ...state,
        token: newToken,
      }));
    },


    // Update user data
    updateUser(userData) {
      update((state) => ({
        ...state,
        user: { ...state.user, ...userData },
      }));
    },

    // Clear error
    clearError() {
      update((state) => ({ ...state, error: null }));
    },
  };
}

export const authStore = createAuthStore();