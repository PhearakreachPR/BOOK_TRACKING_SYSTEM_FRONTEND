<script>
  import { page } from '$app/stores';
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import "../app.css";
  
  let sidebarOpen = true;
  
  const navItems = [
    { href: "/", icon: "📊", label: "Dashboard" },
    { href: "/book-management", icon: "📖", label: "Book Management" },
    { href: "/category-management", icon: "📋", label: "Category" },
    { href: "/user-management", icon: "👥", label: "Users" },
    { href: "/table-management", icon: "🪑", label: "Tables" },
    { href: "/shelf-management", icon: "🚪", label: "Shelves" },
    { href: "/borrow-return", icon: "🔄", label: "Borrow/Return" },
    { href: "/fines", icon: "💰", label: "Fines" },
    { href: "/settings", icon: "⚙️", label: "Settings" }
  ];
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
  <!-- Header -->
  <Header />

  <!-- Main container -->
  <div class="flex flex-1 relative">
    <!-- Full Sidebar - expanded -->
    {#if sidebarOpen}
      <div class="w-64 bg-[#243c6a] fixed left-0 top-16 bottom-0 overflow-y-auto transition-transform duration-300">
        <Sidebar onClose={() => (sidebarOpen = false)} />
      </div>
    {:else}
      <!-- Collapsed Sidebar - icon only -->
      <div class="w-20 bg-[#243c6a] fixed left-0 top-16 bottom-0 overflow-y-auto flex flex-col items-center py-4 space-y-2">
        <button
          on:click={() => (sidebarOpen = true)}
          class="hover:bg-orange-500 rounded p-2 transition text-white text-2xl"
          aria-label="Expand sidebar"
          title="Expand menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div class="w-full border-t border-blue-600 my-2"></div>
        
        {#each navItems as item}
          <a
            href={item.href}
            class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-orange-500 transition text-2xl"
            title={item.label}
            aria-label={item.label}
            class:bg-orange-500={$page.url.pathname === item.href}
          >
            {item.icon}
          </a>
        {/each}
      </div>
    {/if}

    <!-- Main content - with dynamic left margin -->
    <main class="flex-1 overflow-y-auto p-8 {sidebarOpen ? 'ml-64' : 'ml-20'}">
      <slot />
    </main>
  </div>
</div>
