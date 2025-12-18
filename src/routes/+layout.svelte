<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import "../app.css";
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Header -->
  <Header />

  <!-- Main container -->
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</div>
