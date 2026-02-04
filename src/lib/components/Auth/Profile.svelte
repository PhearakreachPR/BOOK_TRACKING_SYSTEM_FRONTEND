<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import ChangePasswordModal from './ChangPasswordModal.svelte';
  import authService from '$lib/services/authService';
  
  const dispatch = createEventDispatcher();
  
  // Dynamic user data from auth store
  let user = {
    name: 'User',
    email: 'user@library.com',
    role: 'USER',
    initials: 'U',
    isEmailConfirmed: false
  };
  
  let showDropdown = false;
  let showLogoutModal = false;
  let showChangePasswordModal = false;
  let isLoggingOut = false;
  
  // Subscribe to auth store and update user data
  $: if ($authStore.user) {
    user = {
      name: $authStore.user.name || $authStore.user.fullName || 'User',
      email: $authStore.user.email || 'user@library.com',
      role: $authStore.user.role || 'USER',
      initials: getUserInitials($authStore.user.name || $authStore.user.fullName || 'User'),
      isEmailConfirmed: $authStore.user.isEmailConfirmed || false
    };
  }
  
  onMount(() => {
    // Ensure we have user data
    if ($authStore.user) {
      user = {
        name: $authStore.user.name || $authStore.user.fullName || 'User',
        email: $authStore.user.email || 'user@library.com',
        role: $authStore.user.role || 'USER',
        initials: getUserInitials($authStore.user.name || $authStore.user.fullName || 'User'),
        isEmailConfirmed: $authStore.user.isEmailConfirmed || false
      };
    }
  });
  
  // Get user initials from name
  function getUserInitials(name) {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }
  
  function toggleDropdown(event) {
    event.stopPropagation();
    showDropdown = !showDropdown;
  }
  
  function closeDropdown() {
    showDropdown = false;
  }
  
  function openLogoutModal(event) {
    event.preventDefault();
    event.stopPropagation();
    showLogoutModal = true;
    closeDropdown();
  }
  
  function closeLogoutModal() {
    showLogoutModal = false;
  }
  
  async function handleLogout() {
    isLoggingOut = true;
    
    try {
      console.log('Logging out...');
      
      // Call the actual logout service
      await authService.logout();
      
      // Dispatch logout event
      dispatch('logout');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      isLoggingOut = false;
      showLogoutModal = false;
    }
  }
  
  function navigateToProfile(event) {
    event.preventDefault();
    event.stopPropagation();
    closeDropdown();
    dispatch('navigate', 'profile');
  }
  
  function navigateToSettings(event) {
    event.preventDefault();
    event.stopPropagation();
    closeDropdown();
    dispatch('navigate', 'settings');
  }
  
  function openChangePasswordModal(event) {
    event.preventDefault();
    event.stopPropagation();
    closeDropdown();
    showChangePasswordModal = true;
  }
  
  function closeChangePasswordModal() {
    showChangePasswordModal = false;
  }
  
  function handleClickOutside(event) {
    const target = event.target;
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (showDropdown && profileDropdown && !profileDropdown.contains(target)) {
      closeDropdown();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="profile-dropdown relative">
  <!-- User Profile Button -->
  <button 
    type="button"
    on:click={toggleDropdown}
    class="flex items-center gap-3 pl-6 border-l border-blue-500 hover:bg-blue-500/20 rounded-lg p-2 transition"
  >
    <div class="text-right hidden md:block">
      <p class="text-sm font-semibold">{user.name}</p>
      <p class="text-xs text-blue-100">{user.email}</p>
    </div>
    <div class="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:ring-2 hover:ring-white transition">
      {user.initials}
    </div>
    <svg 
      class="w-4 h-4 transition-transform {showDropdown ? 'rotate-180' : ''}" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <!-- Dropdown Menu -->
  {#if showDropdown}
    <div class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50">
      <div class="px-4 py-3 border-b border-gray-200">
        <p class="text-sm font-semibold text-gray-900">{user.name}</p>
        <p class="text-xs text-gray-600">{user.email}</p>
        <div class="flex items-center gap-2 mt-1">
          <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full {
            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
            user.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }">
            {user.role}
          </span>
          {#if user.isEmailConfirmed}
            <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Verified
            </span>
          {/if}
        </div>
      </div>

      <div class="py-2">
        <button
          type="button"
          on:click={navigateToProfile}
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition text-left"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </button>

        <button
          type="button"
          on:click={navigateToSettings}
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition text-left"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>

        <button
          type="button"
          on:click={openChangePasswordModal}
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition text-left"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Change Password
        </button>
      </div>

      <div class="border-t border-gray-200 pt-2">
        <button
          type="button"
          on:click={openLogoutModal}
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  {/if}
</div>

<!-- Change Password Modal -->
<ChangePasswordModal 
  isOpen={showChangePasswordModal}
  on:close={closeChangePasswordModal}
/>

<!-- Logout Confirmation Modal -->
{#if showLogoutModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    on:click={closeLogoutModal}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      on:click|stopPropagation
    >
      <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-center">
        <div class="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-4">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Confirm Logout</h2>
        <p class="text-red-100">Are you sure you want to logout?</p>
      </div>

      <div class="px-6 py-6">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-yellow-800 mb-1">Before you go:</p>
              <ul class="text-xs text-yellow-700 space-y-1">
                <li>• Any unsaved changes will be lost</li>
                <li>• You'll need to login again to access your account</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            on:click={closeLogoutModal}
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            type="button"
            on:click={handleLogout}
            class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 flex items-center justify-center"
            disabled={isLoggingOut}
          >
            {#if isLoggingOut}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging out...
            {:else}
              Yes, Logout
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}