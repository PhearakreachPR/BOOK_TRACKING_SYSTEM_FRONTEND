<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/authStore';
  import "../app.css";

  let isInitialized = false;

  // Initialize auth when app loads
  onMount(async () => {
    console.log(' Initializing authentication...');
    await authStore.init();
    isInitialized = true;
    console.log(' Authentication initialized');
  });

  // Show loading state while initializing
  $: isLoading = $authStore.isLoading || !isInitialized;
</script>

{#if isLoading}
  <!-- Loading Screen -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <p class="text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  </div>
{:else}
  <!-- Main App Content -->
  <slot />
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>