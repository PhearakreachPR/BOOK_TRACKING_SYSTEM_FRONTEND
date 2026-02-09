<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import QRCode from "qrcode";
  import { tablesStore } from "$lib/stores/tableStore";

  $: tableId = parseInt($page.params.tableId || "0");
  $: tableData = $tablesStore.find(t => t.id === tableId);

  $: table = {
    id: tableId,
    tableNumber: tableData?.tableNumber || "Unknown",
    capacity: 4,
    location: "Ground Floor - Section A",
    type: "Study",
    status: tableData?.status || "Available",
    currentUsers: 0,
    notes: "Near the main entrance",
    lastMaintenanceDate: "2026-01-10",
    nextMaintenanceDate: "2026-02-10",
    qrCode: tableData?.qrCode || ""
  };

  let bookingHistory = [
    {
      id: 1,
      userName: "Sarah Johnson",
      date: "2026-01-15",
      time: "14:00 - 16:00",
      duration: "2 hours",
      status: "Completed"
    },
    {
      id: 2,
      userName: "Michael Chen",
      date: "2026-01-14",
      time: "10:00 - 12:30",
      duration: "2.5 hours",
      status: "Completed"
    },
    {
      id: 3,
      userName: "Emily Davis",
      date: "2026-01-13",
      time: "15:00 - 17:00",
      duration: "2 hours",
      status: "Completed"
    }
  ];

  function getStatusColor(status: string) {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Occupied":
        return "bg-blue-100 text-blue-800";
    }
  }

  function downloadQRCode() {
    if (table.qrCode) {
      const link = document.createElement("a");
      link.href = table.qrCode;
      link.download = `table-${table.tableNumber}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center gap-4">
    <button
      on:click={() => goto("/table-management")}
      class="text-blue-600 hover:text-blue-800 font-medium"
    >
      ← Back to Tables
    </button>
    <div>
      <h1 class="text-3xl font-bold text-gray-800">{table.tableNumber}</h1>
      <p class="text-gray-500 mt-1">Table Details & Booking History</p>
    </div>
  </div>

  <!-- Main Details -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Basic Information -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Basic Information</h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500 font-medium mb-1">Table Number</p>
              <p class="text-lg font-semibold text-gray-800">{table.tableNumber}</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- QR Code Section -->
      {#if table.qrCode}
        <Card title="">
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">QR Code</h2>
            <div class="flex flex-col items-center gap-4">
              <img src={table.qrCode} alt="Table QR Code" class="w-64 h-64 border-2 border-gray-200 rounded-lg p-2" />
              <div class="flex gap-3 justify-center">
                <button
                  on:click={downloadQRCode}
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  ↓ Download QR Code
                </button>
              </div>
            </div>
          </div>
        </Card>
      {/if}

      <!-- Booking History -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    User
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Date
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Time
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Duration
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {#each bookingHistory as booking (booking.id)}
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td class="py-3 px-4 font-medium text-gray-800">
                      {booking.userName}
                    </td>
                    <td class="py-3 px-4 text-gray-600">{booking.date}</td>
                    <td class="py-3 px-4 text-gray-600">{booking.time}</td>
                    <td class="py-3 px-4 text-gray-600">{booking.duration}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  </div>
</div>
