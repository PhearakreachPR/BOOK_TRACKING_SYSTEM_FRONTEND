<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let shelf = {
    id: parseInt($page.params.shelfId || "0"),
    shelfCode: "S-001",
    section: "A",
    location: "Ground Floor",
    category: "Fiction",
    capacity: 50,
    booksCount: 45,
    condition: "Good",
    lastAuditDate: "2026-01-10",
    nextAuditDate: "2026-02-10",
    notes: "Main fiction section"
  };

  let books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      addedDate: "2025-12-01"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      addedDate: "2025-11-15"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      addedDate: "2025-10-20"
    }
  ];

  let maintenanceHistory = [
    {
      id: 1,
      date: "2026-01-10",
      type: "Inspection",
      description: "Regular shelf inspection and cleaning",
      status: "Completed"
    },
    {
      id: 2,
      date: "2025-12-15",
      type: "Repair",
      description: "Fixed damaged shelf bracket",
      status: "Completed"
    },
    {
      id: 3,
      date: "2025-11-20",
      type: "Reorganization",
      description: "Books reorganized by title",
      status: "Completed"
    }
  ];

  function getConditionColor(condition: string) {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
  <div class="flex items-center gap-4">
    <button
      on:click={() => goto("/shelf-management")}
      class="text-blue-600 hover:text-blue-800 font-medium"
    >
      ← Back to Shelves
    </button>
    <div>
      <h1 class="text-3xl font-bold text-gray-800">{shelf.shelfCode}</h1>
      <p class="text-gray-500 mt-1">Shelf Details & Inventory</p>
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
              <p class="text-sm text-gray-500 font-medium mb-1">Shelf Code</p>
              <p class="text-lg font-semibold text-gray-800">{shelf.shelfCode}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium mb-1">Category</p>
              <p class="text-lg font-semibold text-gray-800">
                {getCategoryIcon(shelf.category)} {shelf.category}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium mb-1">Section</p>
              <p class="text-lg font-semibold text-gray-800">Section {shelf.section}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium mb-1">Location</p>
              <p class="text-lg font-semibold text-gray-800">{shelf.location}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium mb-1">Capacity</p>
              <p class="text-lg font-semibold text-gray-800">{shelf.capacity} books</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium mb-1">Condition</p>
              <span class="px-3 py-1 rounded-full text-sm font-medium {getConditionColor(shelf.condition)}">
                {shelf.condition}
              </span>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-500 font-medium mb-1">Notes</p>
              <p class="text-lg font-semibold text-gray-800">{shelf.notes}</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Books on Shelf -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Books Stored ({shelf.booksCount})</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Title
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Author
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    ISBN
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-600">
                    Added Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {#each books as book (book.id)}
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td class="py-3 px-4 font-medium text-gray-800">
                      {book.title}
                    </td>
                    <td class="py-3 px-4 text-gray-600">{book.author}</td>
                    <td class="py-3 px-4 text-gray-600">{book.isbn}</td>
                    <td class="py-3 px-4 text-gray-600">{book.addedDate}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <!-- Maintenance History -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Maintenance History</h2>
          <div class="space-y-3">
            {#each maintenanceHistory as record (record.id)}
              <div class="border-l-4 border-blue-500 pl-4 py-2">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold text-gray-800">{record.type}</p>
                    <p class="text-sm text-gray-600">{record.description}</p>
                  </div>
                  <span class="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    {record.status}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{record.date}</p>
              </div>
            {/each}
          </div>
        </div>
      </Card>
    </div>

    <!-- Right Column -->
    <div class="space-y-6">
      <!-- Capacity Card -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Utilization</h2>
          <div class="space-y-4">
            <div class="text-center">
              <p class="text-4xl font-bold text-blue-600">
                {Math.round((shelf.booksCount / shelf.capacity) * 100)}%
              </p>
              <p class="text-sm text-gray-500 mt-2">
                {shelf.booksCount} of {shelf.capacity} books
              </p>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-blue-600 h-3 rounded-full transition-all"
                style="width: {(shelf.booksCount / shelf.capacity) * 100}%"
              ></div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Audit Information -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Audit Schedule</h2>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-500 font-medium uppercase mb-1">
                Last Audit
              </p>
              <p class="font-semibold text-gray-800">{shelf.lastAuditDate}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium uppercase mb-1">
                Next Audit
              </p>
              <p class="font-semibold text-gray-800">{shelf.nextAuditDate}</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Quick Actions -->
      <Card title="">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div class="space-y-2">
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Add Books
            </button>
            <button class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Audit Shelf
            </button>
            <button class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Request Maintenance
            </button>
            <button class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Deactivate Shelf
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</div>
