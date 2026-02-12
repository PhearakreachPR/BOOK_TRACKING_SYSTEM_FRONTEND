import { get } from 'svelte/store';
import { authStore } from '$lib/stores/authStore.js';
import { goto } from '$app/navigation';

// Define role type (safe + flexible)
type UserRole = string;

// Define minimal auth structure (matches your store)
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    role?: UserRole;
  } | null;
}

export function requireAuth(): boolean {
  const auth = get(authStore) as AuthState;

  if (!auth.isAuthenticated && !auth.isLoading) {
    goto('/login');
    return false;
  }

  return true;
}

export function requireRole(allowedRoles: UserRole[]): boolean {
  const auth = get(authStore) as AuthState;

  if (!auth.isAuthenticated) {
    goto('/login');
    return false;
  }

  if (!allowedRoles.includes(auth.user?.role ?? '')) {
    goto('/unauthorized');
    return false;
  }

  return true;
}

export function requireGuest(): boolean {
  const auth = get(authStore) as AuthState;

  if (auth.isAuthenticated) {
    goto('/dashboard');
    return false;
  }

  return true;
}
