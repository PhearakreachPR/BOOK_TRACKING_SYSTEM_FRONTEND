<script lang="ts">
  import { page } from "$app/stores";
  import Card from "$lib/components/Card.svelte";

  interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    categoryId: number;
    publishYear: number;
    stock: number;
    shelf: string;
  }

  interface Category {
    id: number;
    name: string;
    icon: string;
  }

  let categoryId = parseInt($page.params.categoryId ?? "0");

  // Category data
  const categories: Record<number, Category> = {
    1: { id: 1, name: "Fiction", icon: "📖" },
    2: { id: 2, name: "Non-Fiction", icon: "📚" },
    3: { id: 3, name: "Philosophy", icon: "🧠" },
    4: { id: 4, name: "Technology", icon: "💻" },
    5: { id: 5, name: "Science", icon: "🔬" },
    6: { id: 6, name: "History", icon: "🏛️" }
  };

  // Books data
  let allBooks: Book[] = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      categoryId: 1,
      publishYear: 1925,
      stock: 5,
      shelf: "A-1"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      categoryId: 1,
      publishYear: 1960,
      stock: 3,
      shelf: "A-2"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      categoryId: 1,
      publishYear: 1949,
      stock: 7,
      shelf: "A-3"
    },
    {
      id: 4,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "978-0-06-231609-7",
      categoryId: 2,
      publishYear: 2011,
      stock: 4,
      shelf: "B-1"
    },
    {
      id: 5,
      title: "The Art of War",
      author: "Sun Tzu",
      isbn: "978-1-59030-426-1",
      categoryId: 3,
      publishYear: 500,
      stock: 2,
      shelf: "C-1"
    },
    {
      id: 6,
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0-13-235088-4",
      categoryId: 4,
      publishYear: 2008,
      stock: 6,
      shelf: "D-1"
    },
    {
      id: 7,
      title: "Design Patterns",
      author: "Gang of Four",
      isbn: "978-0-201-63361-0",
      categoryId: 4,
      publishYear: 1994,
      stock: 3,
      shelf: "D-2"
    },
    {
      id: 8,
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "978-0-553-38016-3",
      categoryId: 5,
      publishYear: 1988,
      stock: 5,
      shelf: "E-1"
    },
    {
      id: 9,
      title: "The Guns of August",
      author: "Barbara W. Tuchman",
      isbn: "978-0-345-32562-1",
      categoryId: 6,
      publishYear: 1962,
      stock: 2,
      shelf: "F-1"
    }
  ];

  let searchQuery = "";
  let showAddForm = false;
  let editingBook: Book | null = null;
  let formTitle = "";
  let formAuthor = "";
  let formIsbn = "";
  let formPublishYear = 0;
  let formStock = 1;
  let formShelf = "";

  const category = categories[categoryId];

  $: booksInCategory = allBooks.filter(b => b.categoryId === categoryId);
  $: filteredBooks = booksInCategory.filter(
    b =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery)
  );

  function resetForm() {
    formTitle = "";
    formAuthor = "";
    formIsbn = "";
    formPublishYear = 0;
    formStock = 1;
    formShelf = "";
    editingBook = null;
    showAddForm = false;
  }

  function addBook() {
    if (!formTitle.trim() || !formAuthor.trim() || !formIsbn.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const book: Book = {
      id: Math.max(...allBooks.map(b => b.id), 0) + 1,
      title: formTitle,
      author: formAuthor,
      isbn: formIsbn,
      categoryId: categoryId,
      publishYear: formPublishYear || new Date().getFullYear(),
      stock: formStock || 1,
      shelf: formShelf || "TBD"
    };

    allBooks = [...allBooks, book];
    resetForm();
    alert("Book added successfully");
  }

  function updateBook() {
    if (!editingBook) return;
    if (!editingBook.title?.trim() || !editingBook.author?.trim() || !editingBook.isbn?.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const index = allBooks.findIndex(b => b.id === editingBook!.id);
    if (index !== -1) {
      allBooks[index] = editingBook;
      allBooks = allBooks;
    }
    resetForm();
    alert("Book updated successfully");
  }

  function deleteBook(bookId: number) {
    if (confirm("Are you sure you want to delete this book?")) {
      allBooks = allBooks.filter(b => b.id !== bookId);
      alert("Book deleted successfully");
    }
  }

  function startEdit(book: Book) {
    editingBook = { ...book };
    formTitle = book.title;
    formAuthor = book.author;
    formIsbn = book.isbn;
    formPublishYear = book.publishYear;
    formStock = book.stock;
    formShelf = book.shelf;
    showAddForm = false;
  }

  function cancelEdit() {
    editingBook = null;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <a href="/category-management" class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </a>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-4xl">{category?.icon}</span>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{category?.name} Books</h1>
          <p class="text-gray-600 mt-1">{filteredBooks.length} books in this category</p>
        </div>
      </div>
    </div>
    <button
      on:click={() => (showAddForm = !showAddForm)}
      class="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Book
    </button>
  </div>

  <!-- Add/Edit Book Form -->
  {#if showAddForm || editingBook}
    <Card title="">
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-800">{editingBook ? "Edit Book" : "Add New Book"}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="formTitle" class="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              id="formTitle"
              type="text"
              bind:value={formTitle}
              placeholder="Enter book title..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label for="formAuthor" class="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
            <input
              id="formAuthor"
              type="text"
              bind:value={formAuthor}
              placeholder="Enter author name..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label for="formIsbn" class="block text-sm font-semibold text-gray-700 mb-2">ISBN *</label>
            <input
              id="formIsbn"
              type="text"
              bind:value={formIsbn}
              placeholder="Enter ISBN..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label for="formPublishYear" class="block text-sm font-semibold text-gray-700 mb-2">Publish Year</label>
            <input
              id="formPublishYear"
              type="number"
              bind:value={formPublishYear}
              placeholder="Enter publish year..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label for="formStock" class="block text-sm font-semibold text-gray-700 mb-2">Stock Count</label>
            <input
              id="formStock"
              type="number"
              bind:value={formStock}
              placeholder="Enter stock count..."
              min="0"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label for="formShelf" class="block text-sm font-semibold text-gray-700 mb-2">Shelf Location</label>
            <input
              id="formShelf"
              type="text"
              bind:value={formShelf}
              placeholder="Enter shelf location (e.g., A-1)..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t">
          <button
            on:click={editingBook ? updateBook : addBook}
            class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
          >
            {editingBook ? "Update Book" : "Create Book"}
          </button>
          <button
            on:click={editingBook ? cancelEdit : resetForm}
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  {/if}

  <!-- Search Bar -->
  <div class="relative">
    <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search by title, author, or ISBN..."
      bind:value={searchQuery}
      class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  </div>

  <!-- Books Table -->
  <Card title="">
    {#if filteredBooks.length > 0}
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr class="text-left font-semibold text-gray-700">
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Author</th>
              <th class="px-4 py-3">ISBN</th>
              <th class="px-4 py-3">Year</th>
              <th class="px-4 py-3">Stock</th>
              <th class="px-4 py-3">Shelf</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each filteredBooks as book (book.id)}
              <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 font-medium text-gray-900">{book.title}</td>
                <td class="px-4 py-3 text-gray-700">{book.author}</td>
                <td class="px-4 py-3 text-gray-700 font-mono text-xs">{book.isbn}</td>
                <td class="px-4 py-3 text-gray-700">{book.publishYear}</td>
                <td class="px-4 py-3">
                  <span class={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.stock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.stock} copies
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-700 font-mono text-xs">{book.shelf}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      on:click={() => startEdit(book)}
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      on:click={() => deleteBook(book.id)}
                      class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium"
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
    {:else}
      <div class="py-12 text-center">
        <p class="text-gray-500 text-lg font-medium">No books found</p>
        <p class="text-gray-400 mt-2">
          {searchQuery ? "Try adjusting your search" : "Add your first book to get started"}
        </p>
      </div>
    {/if}
  </Card>
</div>
