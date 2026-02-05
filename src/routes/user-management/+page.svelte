<script lang="ts">
  import Card from "$lib/components/Card.svelte";

  interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    lastActive: string;
    status: "Active" | "Suspended" | "Inactive";
    booksBorrowed: number;
    memberSince: string;
  }

  let users: User[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "+1 234-567-8901",
      lastActive: "2 hours ago",
      status: "Active",
      booksBorrowed: 3,
      memberSince: "2023-01-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@email.com",
      phone: "+1 234-567-8902",
      lastActive: "1 day ago",
      status: "Active",
      booksBorrowed: 2,
      memberSince: "2023-03-22"
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@email.com",
      phone: "+1 234-567-8903",
      lastActive: "30 min ago",
      status: "Active",
      booksBorrowed: 1,
      memberSince: "2023-06-10"
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james@email.com",
      phone: "+1 234-567-8904",
      lastActive: "3 hours ago",
      status: "Inactive",
      booksBorrowed: 5,
      memberSince: "2022-11-05"
    },
    {
      id: 5,
      name: "Anna Martinez",
      email: "anna@email.com",
      phone: "+1 234-567-8905",
      lastActive: "5 days ago",
      status: "Suspended",
      booksBorrowed: 1,
      memberSince: "2023-06-18"
    },
    {
      id: 6,
      name: "David Brown",
      email: "david@email.com",
      phone: "+1 234-567-8906",
      lastActive: "10 min ago",
      status: "Active",
      booksBorrowed: 4,
      memberSince: "2023-05-09"
    }
  ];

  let searchQuery = "";

  $: filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  function getStatusColor(status: string) {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Suspended") return "bg-red-100 text-red-800";
    if (status === "Inactive") return "bg-gray-100 text-gray-800";
    return "bg-gray-100 text-gray-800";
  }

  function getStatusBadgeColor(status: string) {
    if (status === "Active") return "bg-green-500";
    if (status === "Suspended") return "bg-red-500";
    if (status === "Inactive") return "bg-gray-500";
    return "bg-gray-500";
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
      <p class="text-gray-600 mt-1">Manage library members and their accounts</p>
    </div>
    <button class="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add New User
    </button>
  </div>

  <!-- Search Bar -->
  <div class="relative">
    <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search by name, email, or phone..."
      bind:value={searchQuery}
      class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  </div>

  <!-- Users Grid -->
  <div class="grid grid-cols-3 gap-6">
    {#each filteredUsers as user (user.id)}
      <Card title="">
        <div class="space-y-4">
          <!-- User Header with Status -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <p class="font-semibold text-gray-900">{user.name}</p>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(user.status)}">
                  {user.status}
                </span>
              </div>
            </div>
            <div class="w-3 h-3 rounded-full {getStatusBadgeColor(user.status)}"></div>
          </div>

          <!-- User Info -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{user.email}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1M3 5v12a2 2 0 002 2h14a2 2 0 002-2V5m-5 5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{user.phone}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last active: {user.lastActive}</span>
            </div>
          </div>

          <!-- Books Borrowed Section -->
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-gray-700 mb-2">Books Borrowed</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-800">{user.booksBorrowed}</span>
              <span class="text-xs text-gray-500">Member Since: {user.memberSince}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 pt-2 border-t">
            <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Activity
            </button>
            <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>

          <!-- Status Action Buttons -->
          <div class="flex gap-2 pt-2">
            {#if user.status === "Suspended"}
              <button class="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition font-medium text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Reactivate
              </button>
            {:else if user.status === "Active"}
              <button class="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition font-medium text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Suspend
              </button>
            {:else}
              <button class="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reactivate
              </button>
            {/if}
            <button class="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      </Card>
    {/each}
  </div>
</div>
