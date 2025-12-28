<script>
  import { page } from '$app/stores';
</script>

<nav class="w-full h-full bg-[#243c6a] text-white flex flex-col">
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
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition {$page.url.pathname === '/category-management' ? 'bg-orange-500' : ''}">
      <a href="/category-management" class="flex items-center gap-3 w-full">
        <span class="text-lg">📋</span>
        Category Management
      </a>
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition {$page.url.pathname === '/user-management' ? 'bg-orange-500' : ''}">
      <a href="/user-management" class="flex items-center gap-3 w-full">
        <span class="text-lg">👥</span>
        User Management
      </a>
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition {$page.url.pathname === '/borrow-return' ? 'bg-orange-500' : ''}">
      <a href="/borrow-return" class="flex items-center gap-3 w-full">
        <span class="text-lg">🔄</span>
        Borrow & Return
      </a>
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition">
      <span class="text-lg">📋</span>
      Reservations
    </li>
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition {$page.url.pathname === '/fines' ? 'bg-orange-500' : ''}">
      <a href="/fines" class="flex items-center gap-3 w-full">
        <span class="text-lg">💰</span>
        Fines
      </a>
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
    <li class="hover:bg-blue-700 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition {$page.url.pathname === '/settings' ? 'bg-orange-500' : ''}">
      <a href="/settings" class="flex items-center gap-3 w-full">
        <span class="text-lg">⚙️</span>
        Settings
      </a>
    </li>
  </ul>
</nav>
