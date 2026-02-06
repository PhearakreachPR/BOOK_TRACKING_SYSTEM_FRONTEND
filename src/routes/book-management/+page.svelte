<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { goto } from "$app/navigation";

  let showAddModal = false;
  let showEditModal = false;
  let editingBook: any = null;
  let newBook = {
    title: "",
    author: "",
    isbn: "",
    category: "Fiction",
    shelf: "",
    stock: 0,
    image: ""
  };

  let books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      category: "Fiction",
      shelf: "A-12",
      stock: 5,
      status: "Available",
      image: ""
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      category: "Fiction",
      shelf: "A-15",
      stock: 3,
      status: "Available",
      image: ""
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      category: "Fiction",
      shelf: "B-08",
      stock: 2,
      status: "Unavailable",
      image: ""
    },
    {
      id: 4,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "978-0-06-231609-7",
      category: "Non-Fiction",
      shelf: "C-22",
      stock: 8,
      status: "Available",
      image: ""
    },
    {
      id: 5,
      title: "The Art of War",
      author: "Sun Tzu",
      isbn: "978-1-59030-426-1",
      category: "Philosophy",
      shelf: "D-11",
      stock: 6,
      status: "Unavailable",
      image: ""
    },
    {
      id: 6,
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0-13-235088-4",
      category: "Technology",
      shelf: "E-05",
      stock: 4,
      status: "Available",
      image: ""
    }
  ];

  let searchQuery = "";

  $: filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  // function getStatusColor(status: string) {
  //   if (status === "Available") return "bg-green-100 text-green-800";
  //   if (status === "Unavailable") return "bg-yellow-100 text-yellow-800";
  //   return "bg-gray-100 text-gray-800";
  // }

  function getCategoryColor(category: string) {
    const colors = {
      "Fiction": "bg-orange-100 text-orange-800",
      "Non-Fiction": "bg-blue-100 text-blue-800",
      "Philosophy": "bg-purple-100 text-purple-800",
      "Technology": "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  function handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        newBook.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function handleEditImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        editingBook.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function handleAddBook() {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      alert("Please fill in all required fields");
      return;
    }

    const bookToAdd = {
      id: Math.max(...books.map(b => b.id), 0) + 1,
      ...newBook,
      status: newBook.stock > 2 ? "Available" : "Low Stock"
    };

    books = [...books, bookToAdd];
    showAddModal = false;
    newBook = {
      title: "",
      author: "",
      isbn: "",
      category: "Fiction",
      shelf: "",
      stock: 0,
      image: ""
    };
  }

  function closeModal() {
    showAddModal = false;
    newBook = {
      title: "",
      author: "",
      isbn: "",
      category: "Fiction",
      shelf: "",
      stock: 0,
      image: ""
    };
  }

  function handleEditBook(book: any) {
    editingBook = { ...book };
    showEditModal = true;
  }

  function handleUpdateBook() {
    if (!editingBook.title || !editingBook.author || !editingBook.isbn) {
      alert("Please fill in all required fields");
      return;
    }

    books = books.map(b => b.id === editingBook.id ? editingBook : b);
    showEditModal = false;
    editingBook = null;
  }

  function closeEditModal() {
    showEditModal = false;
    editingBook = null;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Book Management</h1>
      <p class="text-gray-600 mt-1">Manage your library's book collection</p>
    </div>
    <div class="flex gap-3">
      <button class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Import CSV
      </button>
      <button class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export CSV
      </button>
      <button on:click={() => showAddModal = true} class="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Book
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="relative">
    <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search by title, author, ISBN, or shelf location..."
      bind:value={searchQuery}
      class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
    <button class="absolute right-4 top-3 text-gray-600 hover:text-gray-800" aria-label="Filter">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-6V4m6 6v2m0-2a2 2 0 100 4" />
      </svg>
    </button>
  </div>

  <!-- Books Table -->
  <Card title="">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr class="text-left text-sm font-semibold text-gray-700">
            <th class="px-4 py-3">Book Title</th>
            <th class="px-4 py-3">ISBN</th>
            <th class="px-4 py-3">Category</th>
            <!-- <th class="px-4 py-3">Shelf</th> -->
            <th class="px-4 py-3">Stock</th>
            <!-- <th class="px-4 py-3">Status</th> -->
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each filteredBooks as book (book.id)}
            <tr class="hover:bg-gray-50 transition">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded bg-orange-100 flex items-center justify-center text-orange-600 font-semibold overflow-hidden">
                    {#if book.image}
                      <img src={book.image} alt={book.title} class="w-full h-full object-cover" />
                    {:else}
                      📖
                    {/if}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{book.title}</p>
                    <p class="text-sm text-gray-500">{book.author}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">{book.isbn}</td>
              <td class="px-4 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium {getCategoryColor(book.category)}">
                  {book.category}
                </span>
              </td>
              <!-- <td class="px-4 py-4 text-sm text-gray-600">{book.shelf}</td> -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500" style="width: {(book.stock / 10) * 100}%"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{book.stock}</span>
                </div>
              </td>
              <!-- <td class="px-4 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium {getStatusColor(book.status)}">
                  {book.status}
                </span>
              </td> -->
              <td class="px-4 py-4">
                <div class="flex gap-2">
                  <button on:click={() => goto(`/book-management/${book.id}/details`)} class="p-2 hover:bg-gray-200 rounded transition" title="View">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="p-2 hover:bg-gray-200 rounded transition" on:click={() => handleEditBook(book)} title="Edit">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="p-2 hover:bg-gray-200 rounded transition" title="Delete">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<!-- Add Book Modal -->
{#if showAddModal}
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md">
    <div class="absolute inset-0" role="button" tabindex="0" on:click={closeModal} on:keydown={(e) => { if (e.key === 'Escape') closeModal(); }}></div>
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md relative flex flex-col max-h-[90vh]">
      <button on:click={closeModal} aria-label="Close modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="px-8 pt-8 pb-0">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Book</h2>
      </div>
      
      <form on:submit|preventDefault={handleAddBook} class="space-y-5 px-8 overflow-y-auto flex-1">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Book Title <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={newBook.title}
            placeholder="Enter book title"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Author <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={newBook.author}
            placeholder="Enter author name"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">ISBN <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={newBook.isbn}
            placeholder="Enter ISBN"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            bind:value={newBook.category}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white appearance-none cursor-pointer"
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <!-- <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Shelf Location <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={newBook.shelf}
            placeholder="e.g., A-12"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div> -->

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
          <input
            type="number"
            bind:value={newBook.stock}
            min="0"
            placeholder="0"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Book Cover Image</label>
          <div class="flex flex-col gap-3">
            {#if newBook.image}
              <div class="relative w-full">
                <img src={newBook.image} alt="Book cover preview" class="w-full h-48 object-cover rounded-lg border border-gray-300" />
                <button
                  type="button"
                  aria-label="Remove image"
                  on:click={() => newBook.image = ""}
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {:else}
              <label class="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-orange-500 transition">
                <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                <span class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                <input type="file" accept="image/*" on:change={handleImageUpload} class="hidden" />
              </label>
            {/if}
          </div>
        </div>

        <div class="flex gap-3 pt-6 px-8 pb-8 bg-white border-t border-gray-200 sticky bottom-0">
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-base"
          >
            Add Book
          </button>
          <button
            type="button"
            on:click={closeModal}
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Edit Book Modal -->
{#if showEditModal && editingBook}
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md">
    <div class="absolute inset-0" role="button" tabindex="0" on:click={closeEditModal} on:keydown={(e) => { if (e.key === 'Escape') closeEditModal(); }}></div>
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md relative flex flex-col max-h-[90vh]">
      <button on:click={closeEditModal} aria-label="Close modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="px-8 pt-8 pb-0">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Edit Book</h2>
      </div>
      
      <form on:submit|preventDefault={handleUpdateBook} class="space-y-5 px-8 overflow-y-auto flex-1">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Book Title <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={editingBook.title}
            placeholder="Enter book title"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Author <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={editingBook.author}
            placeholder="Enter author name"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">ISBN <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={editingBook.isbn}
            placeholder="Enter ISBN"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            bind:value={editingBook.category}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white appearance-none cursor-pointer"
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Shelf Location <span class="text-red-500">*</span></label>
          <input
            type="text"
            bind:value={editingBook.shelf}
            placeholder="e.g., A-12"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
          <input
            type="number"
            bind:value={editingBook.stock}
            min="0"
            placeholder="0"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Book Cover Image</label>
          <div class="flex flex-col gap-3">
            {#if editingBook.image}
              <div class="relative w-full">
                <img src={editingBook.image} alt="Book cover preview" class="w-full h-48 object-cover rounded-lg border border-gray-300" />
                <button
                  type="button"
                  aria-label="Remove image"
                  on:click={() => editingBook.image = ""}
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {:else}
              <label class="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-orange-500 transition">
                <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                <span class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                <input type="file" accept="image/*" on:change={handleEditImageUpload} class="hidden" />
              </label>
            {/if}
          </div>
        </div>

        <div class="flex gap-3 pt-6 px-8 pb-8 bg-white border-t border-gray-200 sticky bottom-0">
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-base"
          >
            Save Changes
          </button>
          <button
            type="button"
            on:click={closeEditModal}
            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
