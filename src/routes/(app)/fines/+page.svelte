<script lang="ts">
  import Card from "$lib/components/Card.svelte";

  interface Fine {
    id: string;
    user: string;
    book: string;
    daysOverdue: number;
    amount: number;
    status: "Unpaid" | "Paid";
  }

  let fines: Fine[] = [
    {
      id: "#F0001",
      user: "Sarah Johnson",
      book: "The Great Gatsby",
      daysOverdue: 3,
      amount: 15.00,
      status: "Unpaid"
    },
    {
      id: "#F0002",
      user: "Michael Chen",
      book: "To Kill a Mockingbird",
      daysOverdue: 5,
      amount: 25.00,
      status: "Unpaid"
    },
    {
      id: "#F0003",
      user: "James Wilson",
      book: "1984",
      daysOverdue: 10,
      amount: 50.00,
      status: "Paid"
    },
    {
      id: "#F0004",
      user: "Emily Davis",
      book: "Sapiens",
      daysOverdue: 2,
      amount: 10.00,
      status: "Unpaid"
    },
    {
      id: "#F0005",
      user: "Anna Martinez",
      book: "Clean Code",
      daysOverdue: 8,
      amount: 35.00,
      status: "Paid"
    },
    {
      id: "#F0006",
      user: "David Brown",
      book: "The Art of War",
      daysOverdue: 4,
      amount: 20.00,
      status: "Unpaid"
    }
  ];

  let dailyFineRate = 5.00;
  let maxFineAmount = 100.00;
  let gracePeriod = 2;

  let settingsSaved = false;

  function getStatusColor(status: string) {
    if (status === "Unpaid") return "bg-red-100 text-red-800";
    if (status === "Paid") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  }

  function getStatusBadgeColor(status: string) {
    if (status === "Unpaid") return "text-red-600 bg-red-50 border border-red-200";
    if (status === "Paid") return "text-green-600 bg-green-50 border border-green-200";
    return "text-gray-600 bg-gray-50 border border-gray-200";
  }

  function markAsPaid(fineId: string) {
    const fine = fines.find(f => f.id === fineId);
    if (fine) {
      fine.status = "Paid";
      fines = fines;
      alert(`Fine ${fineId} marked as paid`);
    }
  }

  function sendReminder(userId: string) {
    alert(`Reminder sent to user ${userId}`);
  }

  function updateSettings() {
    settingsSaved = true;
    setTimeout(() => {
      settingsSaved = false;
    }, 3000);
    console.log("Settings updated:", {
      dailyFineRate,
      maxFineAmount,
      gracePeriod
    });
  }

  $: totalFines = fines.reduce((sum, fine) => sum + fine.amount, 0);
  $: unpaidFines = fines.filter(f => f.status === "Unpaid").reduce((sum, f) => sum + f.amount, 0);
  $: collectedThisMonth = fines.filter(f => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0);
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Fines Management</h1>
    <p class="text-gray-600 mt-1">Track and manage overdue fines</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-3 gap-6">
    <Card title="">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-gray-600 text-sm mb-1">Total Fines</p>
          <p class="text-3xl font-bold text-gray-800">${totalFines.toFixed(2)}</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 text-lg">
          💰
        </div>
      </div>
    </Card>

    <Card title="">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-gray-600 text-sm mb-1">Unpaid Fines</p>
          <p class="text-3xl font-bold text-red-600">${unpaidFines.toFixed(2)}</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-lg">
          ⚠️
        </div>
      </div>
    </Card>

    <Card title="">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-gray-600 text-sm mb-1">Collected This Month</p>
          <p class="text-3xl font-bold text-green-600">${collectedThisMonth.toFixed(2)}</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">
          ✓
        </div>
      </div>
    </Card>
  </div>

  <!-- All Fines Table -->
  <Card title="">
    <div>
      <h2 class="text-lg font-bold text-gray-900 mb-4">All Fines</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr class="text-left font-semibold text-gray-700">
              <th class="px-4 py-3">Fine ID</th>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">Book</th>
              <th class="px-4 py-3">Days Overdue</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each fines as fine (fine.id)}
              <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 font-semibold text-gray-900">{fine.id}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                      {fine.user.charAt(0)}
                    </div>
                    <span class="text-gray-700">{fine.user}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-700">{fine.book}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2 text-gray-700">
                    <span>📅</span>
                    <span>{fine.daysOverdue} days</span>
                  </div>
                </td>
                <td class="px-4 py-3 font-semibold text-gray-900">${fine.amount.toFixed(2)}</td>
                <td class="px-4 py-3">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold {getStatusColor(fine.status)}">
                    {fine.status}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    {#if fine.status === "Unpaid"}
                      <button
                        on:click={() => markAsPaid(fine.id)}
                        class="px-3 py-1.5 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-xs font-medium"
                      >
                        Mark Paid
                      </button>
                    {:else}
                      <span class="px-3 py-1.5 text-gray-500 text-xs font-medium">
                        Completed
                      </span>
                    {/if}
                    <button
                      on:click={() => sendReminder(fine.user)}
                      class="px-3 py-1.5 text-gray-500 hover:text-gray-700 transition text-xs"
                      aria-label="More options"
                    >
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </Card>

  <!-- Fine Settings -->
  <Card title="">
    <div>
      <h2 class="text-lg font-bold text-gray-900 mb-6">Fine Settings</h2>
      <div class="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <span class="mr-1">$</span>
            Daily Fine Rate
          </label>
          <input
            type="number"
            bind:value={dailyFineRate}
            step="0.01"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <span class="mr-1">$</span>
            Maximum Fine Amount
          </label>
          <input
            type="number"
            bind:value={maxFineAmount}
            step="0.01"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Grace Period (days)
          </label>
          <input
            type="number"
            bind:value={gracePeriod}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t">
        <div>
          {#if settingsSaved}
            <p class="text-sm text-green-600 font-medium">✓ Settings updated successfully</p>
          {/if}
        </div>
        <button
          on:click={updateSettings}
          class="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          Update Settings
        </button>
      </div>
    </div>
  </Card>
</div>
