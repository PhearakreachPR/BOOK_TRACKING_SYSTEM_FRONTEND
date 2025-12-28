<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import "../app.css";
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
  <!-- Header -->
  <Header />

  <!-- Main container with sidebar fixed and content scrollable -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar - fixed, no scroll -->
    <div class="w-64 bg-[#243c6a] overflow-y-auto">
      <Sidebar />
    </div>

    <!-- Main content - scrollable independently -->
    <main class="flex-1 overflow-y-auto p-8">
      <slot />
    </main>
  </div>
</div>
