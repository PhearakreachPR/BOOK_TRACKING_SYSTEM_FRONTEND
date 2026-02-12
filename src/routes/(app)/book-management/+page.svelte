<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import BookCard from '$lib/components/books/BookCard.svelte';
  import BookForm from '$lib/components/books/BookForm.svelte';
  import { bookService } from '$lib/services/bookService';
  import type { Book, CreateBookDto, UpdateBookDto } from '$lib/types/book.type';

  let books: Book[] = [];
  let filteredBooks: Book[] = [];
  let searchQuery = '';
  let isLoading = true;
  let error = '';

  // Modal states
  let showAddModal = false;
  let showEditModal = false;
  let editingBook: Book | null = null;

  // Statistics
  let stats = {
    totalBooks: 0,
    activeBooks: 0,
    inactiveBooks: 0
  };

  onMount(() => {
    loadBooks();
    loadStats();
  });

  async function loadBooks() {
    try {
      isLoading = true;
      error = '';
      const response = await bookService.getAllBooks();
      books = response.data;
      filteredBooks = books;
    } catch (err: any) {
      error = err.message || 'Failed to load books';
      console.error('Error loading books:', err);
    } finally {
      isLoading = false;
    }
  }

  async function loadStats() {
    try {
      const response = await bookService.getBookStats();
      stats = response.data;
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  // Search functionality
  $: {
    if (searchQuery.trim()) {
      filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.isbn && book.isbn.includes(searchQuery))
      );
    } else {
      filteredBooks = books;
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      filteredBooks = books;
      return;
    }

    try {
      const response = await bookService.searchBooks(searchQuery);
      filteredBooks = response.data;
    } catch (err: any) {
      error = err.message || 'Search failed';
    }
  }

  // CRUD Operations
  async function handleCreateBook(event: CustomEvent) {
    try {
      const createData: CreateBookDto = event.detail;
      await bookService.createBook(createData);
      showAddModal = false;
      await loadBooks();
      await loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to create book');
    }
  }

  async function handleUpdateBook(event: CustomEvent) {
    if (!editingBook) return;

    try {
      const updateData: UpdateBookDto = event.detail;
      await bookService.updateBook(editingBook.id, updateData);
      showEditModal = false;
      editingBook = null;
      await loadBooks();
      await loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update book');
    }
  }

  async function handleDeleteBook(book: Book) {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      await bookService.deleteBook(book.id);
      await loadBooks();
      await loadStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete book');
    }
  }

  // Event handlers
  function handleViewBook(event: CustomEvent<Book>) {
    goto(`/book-management/${event.detail.id}`);
  }

  function handleEditBook(event: CustomEvent<Book>) {
    editingBook = event.detail;
    showEditModal = true;
  }

  function handleViewCopies(event: CustomEvent<Book>) {
    goto(`/book-management/${event.detail.id}/copies`);
  }

  function openAddModal() {
    showAddModal = true;
  }

  function closeAddModal() {
    showAddModal = false;
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
    <button
      on:click={openAddModal}
      class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add New Book
    </button>
  </div>

  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card title="">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-lg">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <p class="text-gray-600 font-medium">Total Books</p>
          <p class="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
        </div>
      </div>
    </Card>

    <Card title="">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-green-100 rounded-lg">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-gray-600 font-medium">Active Books</p>
          <p class="text-3xl font-bold text-gray-900">{stats.activeBooks}</p>
        </div>
      </div>
    </Card>

    <Card title="">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-gray-100 rounded-lg">
          <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <div>
          <p class="text-gray-600 font-medium">Inactive Books</p>
          <p class="text-3xl font-bold text-gray-900">{stats.inactiveBooks}</p>
        </div>
      </div>
    </Card>
  </div>

  <!-- Search Bar -->
  <Card title="">
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <input
          type="text"
          bind:value={searchQuery}
          on:input={handleSearch}
          placeholder="Search by title, author, or ISBN..."
          class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </Card>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {error}
    </div>
  {/if}

  <!-- Books Grid -->
  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading books...</p>
      </div>
    </div>
  {:else if filteredBooks.length === 0}
    <Card title="">
      <div class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="text-gray-600 text-lg">No books found</p>
        <p class="text-gray-500 mt-2">
          {searchQuery ? 'Try a different search term' : 'Click "Add New Book" to get started'}
        </p>
      </div>
    </Card>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredBooks as book (book.id)}
        <BookCard
          {book}
          on:view={handleViewBook}
          on:edit={handleEditBook}
          on:delete={() => handleDeleteBook(book)}
          on:viewCopies={handleViewCopies}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Add Book Modal -->
{#if showAddModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Add New Book</h2>
      </div>
      <div class="p-6">
        <BookForm on:submit={handleCreateBook} on:cancel={closeAddModal} />
      </div>
    </div>
  </div>
{/if}

<!-- Edit Book Modal -->
{#if showEditModal && editingBook}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Edit Book</h2>
      </div>
      <div class="p-6">
        <BookForm book={editingBook} isEditing={true} on:submit={handleUpdateBook} on:cancel={closeEditModal} />
      </div>
    </div>
  </div>
{/if}