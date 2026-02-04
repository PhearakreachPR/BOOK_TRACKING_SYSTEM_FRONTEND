<script>
  import { goto } from '$app/navigation';
  import Profile from "./Auth/Profile.svelte";

  let isDarkMode = false;

  let user = {
    name: 'Admin User',
    email: 'admin@library.com',
    role: 'ADMIN',
    initials: 'AU'
  };

  function handleLogout() {
    console.log('User logged out');
    // Clear auth state
    localStorage.removeItem('authToken');
    // Redirect to login
    window.location.href = '/auth';
  }

    /**
   * @param {{ detail: any; }} event
   */
  //   function handleNavigate(event) {
  //   const destination = event.detail;
  //   console.log('Navigate to:', destination);
    
  //   if (destination === 'changePassword') {
  //     window.location.href = '/auth/change-password';
  //   } else if (destination === 'profile') {
  //     window.location.href = '/profile';
  //   } else if (destination === 'settings') {
  //     window.location.href = '/settings';
  //   }
  // }

    function handleNavigate(event) {
    const destination = event.detail;

    if (destination === 'profile') {
      goto('/profile');
    }

    if (destination === 'changePassword') {
      goto('/change-password');
    }

    if (destination === 'settings') {
      goto('/settings'); // optional, create later
    }
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
  }
</script>

<header class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-3">
    <div class="text-3xl">📚</div>
    <h1 class="text-xl font-semibold">Welcome to ITC Library</h1>
  </div>

  <div class="flex items-center gap-6">
    <!-- Notification Bell -->
    <button class="relative hover:bg-blue-500 p-2 rounded-full transition" aria-label="Notifications">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>

    <!-- Theme Toggle -->
    <button on:click={toggleTheme} class="hover:bg-blue-500 p-2 rounded-full transition" aria-label="Toggle theme">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <!-- User Profile -->
    <Profile 
      {user}  
      on:logout={handleLogout}
      on:navigate={handleNavigate}
    />
  </div>
</header>
