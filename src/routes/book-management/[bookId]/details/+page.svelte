<script lang="ts">
  import { page } from "$app/stores";
  import Card from "$lib/components/Card.svelte";

  interface BookMovement {
    id: number;
    barcode: string;
    type: "Borrowed" | "Returned" | "Moved" | "Added" | "Damaged";
    date: string;
    from: string;
    to: string;
    user?: string;
    notes?: string;
  }

  interface Book {
    id: number;
    title: string;
    author: string;
    barcode: string;
    isbn: string;
    category: string;
    currentLocation: string;
    status: "Unavailable" | "Available";
    dateAdded: string;
  }

  interface BookCopy {
    barcode: string;
    location: string;
    status: "Unavailable" | "Available";
  }

  let bookId = parseInt($page.params.bookId ?? "0");
  let selectedBarcode = "";

  // Sample book data
  const booksData: Record<number, Book> = {
    1: {
      id: 1,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      barcode: "9780141439518",
      isbn: "9780141439518",
      category: "Romance",
      currentLocation: "Borrowed",
      status: "Unavailable",
      dateAdded: "1/15/2024"
    },
    2: {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      barcode: "978-0-06-112008-4",
      isbn: "978-0-06-112008-4",
      category: "Fiction",
      currentLocation: "Shelf A-15",
      status: "Available",
      dateAdded: "2/10/2024"
    },
    3: {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      barcode: "978-0-7432-7356-5",
      isbn: "978-0-7432-7356-5",
      category: "Fiction",
      currentLocation: "Shelf A-12",
      status: "Available",
      dateAdded: "1/05/2024"
    }
  };

  // Book copies with their locations and status
  const bookCopies: Record<number, BookCopy[]> = {
    1: [
      { barcode: "9780141439518-1", location: "Borrowed", status: "Unavailable" },
      { barcode: "9780141439518-2", location: "Shelf A-20", status: "Available" },
      { barcode: "9780141439518-3", location: "Shelf A-20", status: "Available" },
      { barcode: "9780141439518-4", location: "On table A-6", status: "Unavailable" },
      { barcode: "9780141439518-5", location: "Shelf A-20", status: "Available" }
    ],
    2: [
      { barcode: "978-0-06-112008-4-1", location: "Shelf A-15", status: "Available" },
      { barcode: "978-0-06-112008-4-2", location: "Shelf A-15", status: "Available" }
    ],
    3: [
      { barcode: "978-0-7432-7356-5-1", location: "on table A1", status: "Available" },
      { barcode: "978-0-7432-7356-5-2", location: "Borrowed", status: "Unavailable" }
    ]
  };

  // Sample movement history
  const movementHistory: Record<number, BookMovement[]> = {
    1: [
      {
        id: 1,
        barcode: "9780141439518-1",
        type: "Borrowed",
        date: "12/18/2025",
        from: "Shelf",
        to: "Borrowed",
        user: "John Smith",
        notes: ""
      },
      {
        id: 2,
        barcode: "9780141439518-1",
        type: "Returned",
        date: "12/10/2025",
        from: "User: Maria Garcia",
        to: "Shelf A-20",
        notes: "Good condition"
      },
      {
        id: 3,
        barcode: "9780141439518-2",
        type: "Borrowed",
        date: "11/28/2025",
        from: "Shelf A-20",
        to: "Borrowed",
        user: "Maria Garcia",
        notes: ""
      },
      {
        id: 4,
        barcode: "9780141439518-3",
        type: "Moved",
        date: "11/15/2025",
        from: "Shelf A-15",
        to: "Shelf A-20",
        notes: "Reorganization"
      },
      {
        id: 5,
        barcode: "9780141439518-4",
        type: "Added",
        date: "1/15/2024",
        from: "System",
        to: "Shelf A-15",
        notes: "New acquisition"
      },
      {
        id: 6,
        barcode: "9780141439518-5",
        type: "Added",
        date: "1/15/2024",
        from: "System",
        to: "Shelf A-15",
        notes: "New acquisition"
      }
    ],
    2: [
      {
        id: 1,
        barcode: "978-0-06-112008-4-1",
        type: "Added",
        date: "2/10/2024",
        from: "System",
        to: "Shelf A-15",
        notes: "Initial entry"
      }
    ],
    3: [
      {
        id: 1,
        barcode: "978-0-7432-7356-5-1",
        type: "Borrowed",
        date: "12/15/2025",
        from: "Shelf A-12",
        to: "Borrowed",
        user: "Alex Johnson",
        notes: ""
      },
      {
        id: 2,
        barcode: "978-0-7432-7356-5-1",
        type: "Returned",
        date: "12/05/2025",
        from: "User: Robert Wilson",
        to: "Shelf A-12",
        notes: "Excellent condition"
      },
      {
        id: 3,
        barcode: "978-0-7432-7356-5-1",
        type: "Added",
        date: "1/05/2024",
        from: "System",
        to: "Shelf A-12",
        notes: "Library purchase"
      },
      {
        id: 4,
        barcode: "978-0-7432-7356-5-2",
        type: "Added",
        date: "1/05/2024",
        from: "System",
        to: "Shelf A-12",
        notes: "Library purchase"
      }
    ]
  };

  const book = booksData[bookId];
  const copies = bookCopies[bookId] || [];
  const allMovements = movementHistory[bookId] || [];

  $: selectedCopy = copies.find(c => c.barcode === selectedBarcode) || copies[0];
  $: if (!selectedBarcode && copies.length > 0) selectedBarcode = copies[0].barcode;
  $: filteredMovements = allMovements.filter(m => m.barcode === selectedBarcode);

  function getStatusBadgeColor(status: string) {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Borrowed":
        return "bg-blue-100 text-blue-800";
      case "Damaged":
        return "bg-red-100 text-red-800";
      case "Lost":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getMovementTypeIcon(type: string) {
    switch (type) {
      case "Borrowed":
        return "📤";
      case "Returned":
        return "📥";
      case "Moved":
        return "📍";
      case "Added":
        return "✅";
      case "Damaged":
        return "⚠️";
      default:
        return "📋";
    }
  }

  function getMovementTypeColor(type: string) {
    switch (type) {
      case "Borrowed":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "Returned":
        return "bg-green-50 border-l-4 border-green-500";
      case "Moved":
        return "bg-orange-50 border-l-4 border-orange-500";
      case "Added":
        return "bg-purple-50 border-l-4 border-purple-500";
      case "Damaged":
        return "bg-red-50 border-l-4 border-red-500";
      default:
        return "bg-gray-50 border-l-4 border-gray-500";
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <a
      href="/book-management"
      class="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Books
    </a>
  </div>

  {#if book}
    <!-- Book Details Card -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-8 text-white flex items-center justify-between shadow-lg mb-8">
      <div>
        <h1 class="text-4xl font-bold leading-tight">{book.title}</h1>
        <p class="text-orange-100 mt-2 text-lg">by {book.author}</p>
      </div>
      <div class="text-8xl opacity-80">📖</div>
    </div>

    <!-- Main Details Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Book Info -->
      <div class="lg:col-span-2 space-y-6">
        <Card title="">
          <div class="space-y-6">
            <!-- Title -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">📕</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Title</p>
                <p class="text-lg font-bold text-gray-900">{book.title}</p>
              </div>
            </div>

            <hr class="border-gray-200" />

            <!-- Author -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">👤</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Author</p>
                <p class="text-lg font-bold text-gray-900">{book.author}</p>
              </div>
            </div>

            <hr class="border-gray-200" />

            <!-- Barcode Selection -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">📊</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Barcode</p>
                <select bind:value={selectedBarcode} class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {#each copies as copy}
                    <option value={copy.barcode}>{copy.barcode}</option>
                  {/each}
                </select>
              </div>
            </div>

            <hr class="border-gray-200" />

            <!-- ISBN -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">📚</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">ISBN</p>
                <p class="text-lg font-mono font-bold text-gray-900">{book.isbn}</p>
              </div>
            </div>

            <hr class="border-gray-200" />

            <!-- ISBN -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">📅</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Added to System</p>
                <p class="text-lg font-bold text-gray-900">{book.dateAdded}</p>
              </div>
            </div>

            <hr class="border-gray-200" />

            <!-- Category -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100">
                <span class="text-lg">🏷️</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Category</p>
                <span class="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-sm">
                  {book.category}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Right Column - Status -->
      <div>
        <Card title="">
          <div class="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-2xl p-6 space-y-6 border border-orange-100">
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">Copy Details</h3>
            </div>

            <!-- Current Location -->
            <div class="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-sm">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Current Location</p>
              <p class="text-2xl font-bold text-gray-900">📍 {selectedCopy?.location || "N/A"}</p>
            </div>

            <!-- Status -->
            <div class="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Copy Status</p>
              <span class={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusBadgeColor(selectedCopy?.status || "Available")}`}>
                {selectedCopy?.status || "N/A"}
              </span>
            </div>

            <!-- Stock Info -->
            <!-- <div class="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white shadow-lg text-center">
              <p class="text-xs font-bold text-orange-100 uppercase tracking-wide mb-2">Total Copies</p>
              <div class="text-5xl font-bold mb-2">{copies.length}</div>
              <p class="text-orange-100 font-medium">Available in Stock</p>
            </div> -->
          </div>
        </Card>
      </div>
    </div>

    <!-- Movement History Section -->
    <Card title="">
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Movement History
          </h2>
          <p class="text-gray-600 mt-1">Complete transaction history of this book</p>
        </div>

        <div class="space-y-4">
          {#each filteredMovements as movement (movement.id)}
            <div class={`p-4 rounded-lg ${getMovementTypeColor(movement.type)}`}>
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 text-3xl">
                  {getMovementTypeIcon(movement.type)}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-bold text-gray-900 text-lg">{movement.type}</p>
                      <p class="text-sm text-gray-600 mt-1">
                        <span class="font-semibold">From:</span> {movement.from} <span class="mx-2">→</span> <span class="font-semibold">To:</span> {movement.to}
                      </p>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <p class="text-sm font-semibold text-gray-700">{movement.date}</p>
                      {#if movement.user}
                        <p class="text-xs text-gray-600 mt-1">{movement.user}</p>
                      {/if}
                    </div>
                  </div>
                  {#if movement.notes}
                    <p class="text-sm text-gray-700 mt-2 italic">📝 {movement.notes}</p>
                  {/if}
                </div>
              </div>
            </div>
          {/each}

          {#if filteredMovements.length === 0}
            <div class="py-8 text-center">
              <p class="text-gray-500 text-lg">No movement history for this copy</p>
            </div>
          {/if}
        </div>
      </div>
    </Card>
  {:else}
    <Card title="">
      <div class="py-12 text-center">
        <p class="text-gray-500 text-lg font-medium">Book not found</p>
      </div>
    </Card>
  {/if}
</div>
