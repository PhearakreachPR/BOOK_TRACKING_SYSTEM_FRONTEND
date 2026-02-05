<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { goto } from "$app/navigation";
  import QRCode from "qrcode";

  let showAddModal = false;
  let showEditModal = false;
  let editingShelf: any = null;
  let isAddingShelf = false;
  let newShelf = {
    shelfCode: "",
    location: "",
    capacity: 0,
    category: "General"
  };

  let shelves = [
    {
      id: 1,
      shelfCode: "S-001",
      location: "Ground Floor",
      category: "Fiction",
      capacity: 50,
      booksCount: 45,
      lastAuditDate: "2026-01-10",
      qrCode: ""
    },
    {
      id: 2,
      shelfCode: "S-002",
      location: "Ground Floor",
      category: "Non-Fiction",
      capacity: 50,
      booksCount: 48,
      lastAuditDate: "2026-01-08",
      qrCode: ""
    },
    {
      id: 3,
      shelfCode: "S-003",
      location: "Ground Floor",
      category: "Reference",
      capacity: 40,
      booksCount: 38,
      lastAuditDate: "2026-01-12",
      qrCode: ""
    },
    {
      id: 4,
      shelfCode: "S-004",
      location: "First Floor",
      category: "Science",
      capacity: 50,
      booksCount: 42,
      lastAuditDate: "2026-01-05",
      qrCode: ""
    },
    {
      id: 5,
      shelfCode: "S-005",
      location: "First Floor",
      category: "History",
      capacity: 50,
      booksCount: 50,
      lastAuditDate: "2026-01-11",
      qrCode: ""
    },
    {
      id: 6,
      shelfCode: "S-006",
      location: "Second Floor",
      category: "Technology",
      capacity: 45,
      booksCount: 25,
      lastAuditDate: "2026-01-03",
      qrCode: ""
    }
  ];

  function openAddModal() {
    newShelf = {
      shelfCode: "",
      location: "",
      capacity: 0,
      category: "General"
    };
    showAddModal = true;
  }

  function closeAddModal() {
    showAddModal = false;
  }

  function closeEditModal() {
    showEditModal = false;
    editingShelf = null;
  }

  function addShelf() {
    if (
      newShelf.shelfCode &&
      newShelf.location &&
      newShelf.capacity > 0
    ) {
      isAddingShelf = true;
      const newId = Math.max(...shelves.map(s => s.id), 0) + 1;
      const qrData = `SHELF-${newId}-${newShelf.shelfCode}`;
      
      // Generate QR code
      QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 1,
        width: 300
      }).then((qrCodeUrl: string) => {
        shelves = [
          ...shelves,
          {
            id: newId,
            ...newShelf,
            booksCount: 0,
            lastAuditDate: new Date().toISOString().split('T')[0],
            qrCode: qrCodeUrl
          }
        ];
        isAddingShelf = false;
        closeAddModal();
      }).catch((error) => {
        console.error("Error generating QR code:", error);
        isAddingShelf = false;
        alert("Error creating shelf. Please try again.");
      });
    } else {
      alert("Please fill in all required fields");
    }
  }

  function editShelf(shelf: any) {
    editingShelf = { ...shelf };
    showEditModal = true;
  }

  function saveEdit() {
    if (editingShelf) {
      shelves = shelves.map(s =>
        s.id === editingShelf.id ? editingShelf : s
      );
      closeEditModal();
    }
  }

  function deleteShelf(id: number) {
    if (confirm("Are you sure you want to delete this shelf?")) {
      shelves = shelves.filter(s => s.id !== id);
    }
  }

  function viewDetails(id: number) {
    goto(`/shelf-management/${id}/details`);
  }

  function getCapacityPercentage(books: number, capacity: number): number {
    return Math.round((books / capacity) * 100);
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case "Fiction":
        return "📖";
      case "Non-Fiction":
        return "📚";
      case "Reference":
        return "📕";
      case "Science":
        return "🔬";
      case "History":
        return "📜";
      case "Technology":
        return "💻";
      default:
        return "📋";
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Shelf Management</h1>
      <p class="text-gray-500 mt-2">Organize and manage library shelves and inventory</p>
    </div>
    <button
      on:click={openAddModal}
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
    >
      + Add Shelf
    </button>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-4 gap-4">
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Total Shelves</div>
        <div class="text-3xl font-bold text-gray-800 mt-2">{shelves.length}</div>
      </div>
    </Card>
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Total Capacity</div>
        <div class="text-3xl font-bold text-blue-600 mt-2">
          {shelves.reduce((sum, s) => sum + s.capacity, 0)}
        </div>
      </div>
    </Card>
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Books Stored</div>
        <div class="text-3xl font-bold text-green-600 mt-2">
          {shelves.reduce((sum, s) => sum + s.booksCount, 0)}
        </div>
      </div>
    </Card>
    <Card title="">
      <div class="p-6">
        <div class="text-gray-500 text-sm font-medium">Avg. Utilization</div>
        <div class="text-3xl font-bold text-orange-600 mt-2">
          {Math.round(
            (shelves.reduce((sum, s) => sum + s.booksCount, 0) /
              shelves.reduce((sum, s) => sum + s.capacity, 0)) *
              100
          )}%
        </div>
      </div>
    </Card>
  </div>

  <!-- Shelves List -->
  <Card title="">
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">All Shelves</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Shelf Code
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Category
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Location
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Capacity
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Utilization
              </th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {#each shelves as shelf (shelf.id)}
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-4 font-medium text-gray-800">
                  {shelf.shelfCode}
                </td>
                <td class="py-3 px-4">
                  <span class="flex items-center gap-2">
                    {getCategoryIcon(shelf.category)}
                    {shelf.category}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-600">{shelf.location}</td>
                <td class="py-3 px-4 text-gray-600">{shelf.capacity}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full"
                        style="width: {getCapacityPercentage(shelf.booksCount, shelf.capacity)}%"
                      ></div>
                    </div>
                    <span class="text-xs font-medium text-gray-600">
                      {shelf.booksCount}/{shelf.capacity}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex gap-2">
                    <button
                      on:click={() => viewDetails(shelf.id)}
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </button>
                    <button
                      on:click={() => editShelf(shelf)}
                      class="text-orange-600 hover:text-orange-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      on:click={() => deleteShelf(shelf.id)}
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
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Add New Shelf</h2>

      <div class="space-y-4 mb-6">
        <div>
          <label for="addShelfCode" class="block text-sm font-medium text-gray-700 mb-1">
            Shelf Code
          </label>
          <input
            id="addShelfCode"
            type="text"
            bind:value={newShelf.shelfCode}
            placeholder="e.g., S-007"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="addLocation" class="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="addLocation"
            type="text"
            bind:value={newShelf.location}
            placeholder="e.g., Ground Floor"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="addCapacity" class="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            id="addCapacity"
            type="number"
            bind:value={newShelf.capacity}
            min="1"
            placeholder="50"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="addCategory" class="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="addCategory"
            bind:value={newShelf.category}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Fiction</option>
            <option>Non-Fiction</option>
            <option>Reference</option>
            <option>Science</option>
            <option>History</option>
            <option>Technology</option>
            <option>General</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          on:click={addShelf}
          disabled={isAddingShelf}
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {isAddingShelf ? "Adding..." : "Add Shelf"}
        </button>
        <button
          on:click={closeAddModal}
          disabled={isAddingShelf}
          class="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingShelf}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit Shelf</h2>

      <div class="space-y-4 mb-6">
        <div>
          <label for="editShelfCode" class="block text-sm font-medium text-gray-700 mb-1">
            Shelf Code
          </label>
          <input
            id="editShelfCode"
            type="text"
            bind:value={editingShelf.shelfCode}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="editLocation" class="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="editLocation"
            type="text"
            bind:value={editingShelf.location}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="editCapacity" class="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            id="editCapacity"
            type="number"
            bind:value={editingShelf.capacity}
            min="1"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="editCategory" class="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="editCategory"
            bind:value={editingShelf.category}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Fiction</option>
            <option>Non-Fiction</option>
            <option>Reference</option>
            <option>Science</option>
            <option>History</option>
            <option>Technology</option>
            <option>General</option>
          </select>
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
