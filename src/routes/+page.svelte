<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';

  onMount(() => {
    const unsubscribe = authStore.subscribe(state => {
      if (!state.isLoading) {
        // Redirect based on auth state
        if (state.isAuthenticated) {
          goto('/dashboard');  // Logged in -> go to dashboard
        } else {
          goto('/auth');       // Not logged in -> go to login
        }
      }
    });

    return unsubscribe;
  });
</script>

<!-- Loading state while checking auth -->
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="text-center">
    <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
    <p class="text-gray-600 text-lg font-medium">Redirecting...</p>
  </div>
</div>