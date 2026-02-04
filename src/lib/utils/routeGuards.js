import { get } from 'svelte/store';
import { authStore } from '$lib/stores/authStore';
// @ts-ignore
import { goto } from '$app/navigation';

export function requireAuth() {
  const auth = get(authStore);
  
  if (!auth.isAuthenticated && !auth.isLoading) {
    goto('/login');
    return false;
  }
  
  return true;
}

export function requireRole(allowedRoles) {
  const auth = get(authStore);
  
  if (!auth.isAuthenticated) {
    goto('/login');
    return false;
  }
  
  if (!allowedRoles.includes(auth.user?.role)) {
    goto('/unauthorized');
    return false;
  }
  
  return true;
}

export function requireGuest() {
  const auth = get(authStore);
  
  if (auth.isAuthenticated) {
    goto('/dashboard');
    return false;
  }
  
  return true;
}