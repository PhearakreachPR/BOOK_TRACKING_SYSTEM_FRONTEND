<script>
  let isDarkMode = false;

  function toggleTheme() {
    isDarkMode = !isDarkMode;
  }
</script>

<header class="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 flex items-center justify-between shadow-lg">
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
    <div class="flex items-center gap-3 pl-6 border-l border-blue-500">
      <div class="text-right">
        <p class="text-sm font-semibold">Admin</p>
        <p class="text-xs text-blue-100">admin@library.com</p>
      </div>
      <div class="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:ring-2 hover:ring-white transition">
        AD
      </div>
    </div>

    <!-- Logout -->
    <button class="hover:bg-blue-500 p-2 rounded-full transition" title="Logout">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  </div>
</header>
