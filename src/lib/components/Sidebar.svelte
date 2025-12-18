<script>
  import { page } from '$app/stores';
</script>

<nav class="w-64 bg-[#243c6a] text-white flex flex-col">
  <div class="p-2 font-bold text-lg flex items-center gap-1">
  </div>

  <ul class="flex-1 space-y-2 px-4">
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 font-medium cursor-pointer transition {$page.url.pathname === '/' ? 'bg-orange-500' : ''}">
      <a href="/" class="flex items-center gap-3 w-full">
        <span class="text-lg">📊</span>
        Dashboard
      </a>
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition {$page.url.pathname === '/book-management' ? 'bg-orange-500' : ''}">
      <a href="/book-management" class="flex items-center gap-3 w-full">
        <span class="text-lg">📖</span>
        Book Management
      </a>
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">👥</span>
      User Management
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">🔄</span>
      Borrow & Return
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">📋</span>
      Reservations
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">💰</span>
      Fines
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">📱</span>
      Digital Library
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">📈</span>
      Reports
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">📝</span>
      Audit Log
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">⚙️</span>
      Settings
    </li>
  </ul>
</nav>
