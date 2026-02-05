<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { goto } from "$app/navigation";
  import QRCode from "qrcode";

  let showAddModal = false;
  let showEditModal = false;
  let editingTable: any = null;
  let isAddingTable = false;
  let newTable = {
    tableNumber: ""
  };

  let tables = [
    {
      id: 1,
      tableNumber: "T-001",
      status: "Available",
      qrCode: ""
    },
    {
      id: 2,
      tableNumber: "T-002",
      status: "Available",
      qrCode: ""
    },
    {
      id: 3,
      tableNumber: "T-003",
      status: "Occupied",
      qrCode: ""
    },
    {
      id: 4,
      tableNumber: "T-004",
      status: "Available",
      qrCode: ""
    },
    {
      id: 5,
      tableNumber: "T-005",
      status: "Occupied",
      qrCode: ""
    },
    {
      id: 6,
      tableNumber: "T-006",
      status: "Available",
      qrCode: ""
    }
  ];

  function openAddModal() {
    newTable = {
      tableNumber: ""
    };
    showAddModal = true;
  }

  function closeAddModal() {
    showAddModal = false;
  }

  function closeEditModal() {
    showEditModal = false;
    editingTable = null;
  }

  function addTable() {
    if (newTable.tableNumber) {
      isAddingTable = true;
      const newId = Math.max(...tables.map(t => t.id), 0) + 1;
      const qrData = `TABLE-${newId}-${newTable.tableNumber}`;
      
      // Generate QR code
      QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 1,
        width: 300
      }).then((qrCodeUrl: string) => {
        tables = [
          ...tables,
          {
            id: newId,
            ...newTable,
            status: "Available",
            qrCode: qrCodeUrl
          }
        ];
        isAddingTable = false;
        closeAddModal();
      }).catch((error) => {
        console.error("Error generating QR code:", error);
        isAddingTable = false;
        alert("Error creating table. Please try again.");
      });
    } else {
      alert("Please enter a table number");
    }
  }

  function editTable(table: any) {
    editingTable = { ...table };
    showEditModal = true;
  }

  function saveEdit() {
    if (editingTable) {
      tables = tables.map(t =>
        t.id === editingTable.id ? editingTable : t
      );
      closeEditModal();
    }
  }

  function deleteTable(id: number) {
    if (confirm("Are you sure you want to delete this table?")) {
      tables = tables.filter(t => t.id !== id);
    }
  }

  function viewDetails(id: number) {
    goto(`/table-management/${id}/details`);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Occupied":
        return "bg-blue-100 text-blue-800";
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Table Management</h1>
      <p class="text-gray-500 mt-2">Manage library study tables and workspaces</p>
    </div>
    <button
      on:click={openAddModal}
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
    >
      + Add Table
    </button>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-3 gap-3">
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Total Tables</div>
        <div class="text-3xl font-bold text-gray-800 mt-2">{tables.length}</div>
      </div>
    </Card>
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Available</div>
        <div class="text-3xl font-bold text-green-600 mt-2">
          {tables.filter(t => t.status === "Available").length}
        </div>
      </div>
    </Card>
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Occupied</div>
        <div class="text-3xl font-bold text-blue-600 mt-2">
          {tables.filter(t => t.status === "Occupied").length}
        </div>
      </div>
    </Card>
  </div>

  <!-- Tables List -->
  <Card title="">
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">All Tables</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Table Number
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Status
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {#each tables as table (table.id)}
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-4 font-medium text-gray-800">
                  {table.tableNumber}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium {getStatusColor(
                      table.status
                    )}"
                  >
                    {table.status}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex gap-2">
                    <button
                      on:click={() => viewDetails(table.id)}
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </button>
                    <button
                      on:click={() => editTable(table)}
                      class="text-orange-600 hover:text-orange-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      on:click={() => deleteTable(table.id)}
                      class="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
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
</div>

<!-- Add Modal -->
{#if showAddModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Add New Table</h2>

      <div class="space-y-4 mb-6">
        <div>
          <label for="addTableNumber" class="block text-sm font-medium text-gray-700 mb-1">
            Table Number
          </label>
          <input
            id="addTableNumber"
            type="text"
            bind:value={newTable.tableNumber}
            placeholder="e.g., T-007"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button
          on:click={addTable}
          disabled={isAddingTable}
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {isAddingTable ? "Adding..." : "Add Table"}
        </button>
        <button
          on:click={closeAddModal}
          disabled={isAddingTable}
          class="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingTable}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit Table</h2>

      <div class="space-y-4 mb-6">
        <div>
          <label for="editTableNumber" class="block text-sm font-medium text-gray-700 mb-1">
            Table Number
          </label>
          <input
            id="editTableNumber"
            type="text"
            bind:value={editingTable.tableNumber}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="editStatus" class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="editStatus"
            bind:value={editingTable.status}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Available</option>
            <option>Occupied</option>
          </select>
        </div>

        <div>
          <label for="editNotes" class="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <input
            id="editNotes"
            type="text"
            bind:value={editingTable.notes}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button
          on:click={saveEdit}
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Save Changes
        </button>
        <button
          on:click={closeEditModal}
          class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}
