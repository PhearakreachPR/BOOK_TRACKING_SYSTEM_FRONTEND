<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { onMount } from "svelte";
  import { shelvesApi, type Shelf, type CreateShelfDto } from "$lib/api/shelves";
  import QRCode from "qrcode";

  let showAddModal = false;
  let showEditModal = false;
  let showQRModal = false;
  let editingShelf: Shelf | null = null;
  let selectedQRCode: string = "";
  let previewQRCode: string = ""; // QR preview in add modal
  let isLoading = false;
  let isAddingShelf = false;
  let error: string = "";

  let newShelf: CreateShelfDto = {
    shelfCode: "",
    section: "",
    rowNumber: "",
    description: ""
  };

  let shelves: Shelf[] = [];

  onMount(async () => {
    await loadShelves();
  });

  async function loadShelves() {
    isLoading = true;
    error = "";
    const response = await shelvesApi.getAll();
    if (response.error) {
      error = response.error;
    } else if (response.data) {
      shelves = response.data;
    }
    isLoading = false;
  }

  // Generate QR code preview when shelf code changes
  async function updateQRPreview() {
    if (newShelf.shelfCode) {
      try {
        const qrData = `SHELF:${newShelf.shelfCode}`;
        previewQRCode = await QRCode.toDataURL(qrData, {
          errorCorrectionLevel: "H",
          width: 200,
          margin: 1
        });
      } catch (error) {
        console.error("QR preview error:", error);
      }
    } else {
      previewQRCode = "";
    }
  }

  // Watch for shelf code changes
  $: if (newShelf.shelfCode) {
    updateQRPreview();
  }

  function openAddModal() {
    newShelf = {
      shelfCode: "",
      section: "",
      rowNumber: "",
      description: ""
    };
    previewQRCode = "";
    showAddModal = true;
    error = "";
  }

  function closeAddModal() {
    showAddModal = false;
    previewQRCode = "";
    error = "";
  }

  function closeEditModal() {
    showEditModal = false;
    editingShelf = null;
    error = "";
  }

  function closeQRModal() {
    showQRModal = false;
    selectedQRCode = "";
  }

  async function addShelf() {
    if (!newShelf.shelfCode) {
      error = "Shelf code is required";
      return;
    }

    isAddingShelf = true;
    error = "";

    // Backend will auto-generate QR code
    const response = await shelvesApi.create(newShelf);

    if (response.error) {
      error = response.error;
      isAddingShelf = false;
    } else {
      isAddingShelf = false;
      closeAddModal();
      await loadShelves();
    }
  }

  function editShelf(shelf: Shelf) {
    editingShelf = { ...shelf };
    showEditModal = true;
    error = "";
  }

  async function saveEdit() {
    if (!editingShelf) return;
    isLoading = true;
    error = "";

    const response = await shelvesApi.update(editingShelf.id, {
      shelfCode: editingShelf.shelfCode,
      section: editingShelf.section,
      rowNumber: editingShelf.rowNumber,
      description: editingShelf.description,
    });

    if (response.error) {
      error = response.error;
      isLoading = false;
    } else {
      isLoading = false;
      closeEditModal();
      await loadShelves();
    }
  }

  async function deleteShelf(id: string) {
    if (!confirm("Are you sure you want to delete this shelf?")) return;
    const response = await shelvesApi.delete(id);
    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      await loadShelves();
    }
  }

  async function viewQRCode(shelf: Shelf) {
    const response = await shelvesApi.getQRImage(shelf.id);
    if (response.data) {
      selectedQRCode = response.data.qrCode;
      showQRModal = true;
    } else {
      alert("Failed to load QR code");
    }
  }

  function downloadQRCode(shelf: Shelf) {
    const downloadUrl = shelvesApi.getQRDownloadUrl(shelf.id);
    window.open(downloadUrl, '_blank');
  }

  function getCategoryIcon(section: string | undefined) {
    if (!section) return "📋";
    const lower = section.toLowerCase();
    if (lower.includes("fiction")) return "📖";
    if (lower.includes("science")) return "🔬";
    if (lower.includes("history")) return "📜";
    if (lower.includes("tech")) return "💻";
    return "📚";
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Shelf Management</h1>
      <p class="text-gray-500 mt-2">Organize and manage library shelves</p>
    </div>
    <button
      on:click={openAddModal}
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
    >
      + Add Shelf
    </button>
  </div>

  {#if error && !showAddModal && !showEditModal}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  {/if}

  {#if isLoading && shelves.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-500">Loading shelves...</div>
    </div>
  {:else}
    <div class="grid grid-cols-3 gap-4">
      <Card title="">
        <div class="p-6">
          <div class="text-gray-500 text-sm font-medium">Total Shelves</div>
          <div class="text-3xl font-bold text-gray-800 mt-2">{shelves.length}</div>
        </div>
      </Card>
      <Card title="">
        <div class="p-6">
          <div class="text-gray-500 text-sm font-medium">With QR Codes</div>
          <div class="text-3xl font-bold text-blue-600 mt-2">{shelves.length}</div>
        </div>
      </Card>
      <Card title="">
        <div class="p-6">
          <div class="text-gray-500 text-sm font-medium">Sections</div>
          <div class="text-3xl font-bold text-green-600 mt-2">
            {new Set(shelves.map(s => s.section).filter(Boolean)).size}
          </div>
        </div>
      </Card>
    </div>

    <Card title="">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">All Shelves</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Shelf Code</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Section</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Row</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">QR Code</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each shelves as shelf (shelf.id)}
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="py-3 px-4 font-medium text-gray-800">{shelf.shelfCode}</td>
                  <td class="py-3 px-4">
                    <span class="flex items-center gap-2">
                      {getCategoryIcon(shelf.section)}
                      {shelf.section || 'N/A'}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-600">{shelf.rowNumber || 'N/A'}</td>
                  <td class="py-3 px-4">
                    <button
                      on:click={() => viewQRCode(shelf)}
                      class="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View
                    </button>
                    <button
                      on:click={() => downloadQRCode(shelf)}
                      class="ml-2 text-green-600 hover:text-green-800 text-xs font-medium"
                    >
                      Download
                    </button>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
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
          {#if shelves.length === 0}
            <div class="text-center py-8 text-gray-500">
              No shelves found. Create your first shelf!
            </div>
          {/if}
        </div>
      </div>
    </Card>
  {/if}
</div>

<!-- Add Modal with QR Preview -->
{#if showAddModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Add New Shelf</h2>

      {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      {/if}

      <div class="grid grid-cols-2 gap-6">
        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Shelf Code *
            </label>
            <input
              type="text"
              bind:value={newShelf.shelfCode}
              placeholder="e.g., SHELF-A1"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input
              type="text"
              bind:value={newShelf.section}
              placeholder="e.g., Fiction"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Row</label>
            <input
              type="text"
              bind:value={newShelf.rowNumber}
              placeholder="e.g., A"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              bind:value={newShelf.description}
              placeholder="Optional description"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
        </div>

        <!-- QR Preview -->
        <div class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
          {#if previewQRCode}
            <div class="text-center">
              <p class="text-sm font-medium text-gray-700 mb-3">QR Code Preview</p>
              <img src={previewQRCode} alt="QR Preview" class="w-48 h-48 mx-auto" />
              <p class="text-xs text-gray-500 mt-3">SHELF:{newShelf.shelfCode}</p>
            </div>
          {:else}
            <div class="text-center text-gray-400">
              <svg class="w-24 h-24 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <p class="text-sm">Enter shelf code to see QR preview</p>
            </div>
          {/if}
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button
          on:click={addShelf}
          disabled={isAddingShelf || !newShelf.shelfCode}
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {isAddingShelf ? "Adding..." : "Add Shelf"}
        </button>
        <button
          on:click={closeAddModal}
          disabled={isAddingShelf}
          class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal (same as before) -->
{#if showEditModal && editingShelf}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit Shelf</h2>

      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Shelf Code</label>
          <input
            type="text"
            bind:value={editingShelf.shelfCode}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <input
            type="text"
            bind:value={editingShelf.section}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Row</label>
          <input
            type="text"
            bind:value={editingShelf.rowNumber}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button
          on:click={saveEdit}
          disabled={isLoading}
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Save
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

<!-- QR View Modal -->
{#if showQRModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Shelf QR Code</h2>
      <div class="flex justify-center mb-6">
        <img src={selectedQRCode} alt="QR Code" class="w-64 h-64" />
      </div>
      <button
        on:click={closeQRModal}
        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        Close
      </button>
    </div>
  </div>
{/if}