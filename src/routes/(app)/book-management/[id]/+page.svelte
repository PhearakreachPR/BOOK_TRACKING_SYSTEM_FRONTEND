<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import { bookService } from '$lib/services/bookService';
  import { bookcopyService } from '$lib/services/bookcopyService';
  import type { Book, BookCopy } from '$lib/types/book.type';

  let book: Book | null = null;
  let copies: BookCopy[] = [];
  let isLoading = true;
  let error = '';

  $: bookId = parseInt($page.params.id);

  onMount(() => {
    loadBookDetails();
  });

  async function loadBookDetails() {
    try {
      isLoading = true;
      error = '';
      
      // Load book details
      const bookResponse = await bookService.getBookById(bookId);
      book = bookResponse.data;

      // Load book copies
      const copiesResponse = await bookcopyService.getCopiesByBookId(bookId, 1, 100);
      copies = copiesResponse.data;
    } catch (err: any) {
      error = err.message || 'Failed to load book details';
      console.error('Error loading book details:', err);
    } finally {
      isLoading = false;
    }
  }

  function getStatusBadgeColor(status: string): string {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      reference: 'bg-blue-100 text-blue-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  function getCopyStatusBadgeColor(status: string): string {
    const colors = {
      available: 'bg-green-100 text-green-800',
      borrowed: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      lost: 'bg-red-100 text-red-800',
      damaged: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  function formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function handleViewCopies() {
    goto(`/book-management/${bookId}/copies`);
  }

  function handleBack() {
    goto('/book-management');
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-6">
    <button
      on:click={handleBack}
      class="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Books
    </button>
  </div>

  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading book details...</p>
      </div>
    </div>
  {:else if error}
    <Card title="">
      <div class="text-center py-12">
        <p class="text-red-600 text-lg font-medium">{error}</p>
      </div>
    </Card>
  {:else if book}
    <!-- Book Hero Section -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-8 text-white flex items-center justify-between shadow-lg">
      <div class="flex-1">
        <h1 class="text-4xl font-bold leading-tight mb-2">{book.title}</h1>
        <p class="text-orange-100 text-lg">by {book.author}</p>
        {#if book.category}
          <p class="text-orange-100 mt-2">Category: {book.category.name}</p>
        {/if}
      </div>
      <div class="text-8xl opacity-80">📖</div>
    </div>

    <!-- Main Details Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Book Info -->
      <div class="lg:col-span-2">
        <Card title="Book Information">
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

            <!-- ISBN -->
            {#if book.isbn}
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
            {/if}

            <!-- Status -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">🏷️</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Status</p>
                <span class={`inline-block px-4 py-1 rounded-full font-semibold text-sm ${getStatusBadgeColor(book.status)}`}>
                  {book.status}
                </span>
              </div>
            </div>

            <hr class="border-gray-200" />

            <!-- Added to System -->
            <div class="flex items-start gap-4">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                <span class="text-lg">📅</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-600 uppercase">Added to System</p>
                <p class="text-lg font-bold text-gray-900">{formatDate(book.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Right Column - Statistics -->
      <div>
        <Card title="Copy Statistics">
          <div class="space-y-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <p class="text-blue-600 font-semibold mb-2">Total Copies</p>
              <p class="text-4xl font-bold text-blue-900">{copies.length}</p>
            </div>

            <div class="space-y-2">
              {#each ['available', 'borrowed', 'maintenance', 'lost', 'damaged'] as status}
                {@const count = copies.filter(c => c.status === status).length}
                {#if count > 0}
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class={`px-3 py-1 rounded-full text-xs font-semibold ${getCopyStatusBadgeColor(status)}`}>
                      {status}
                    </span>
                    <span class="font-bold text-gray-900">{count}</span>
                  </div>
                {/if}
              {/each}
            </div>

            <button
              on:click={handleViewCopies}
              class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition mt-4"
            >
              View All Copies
            </button>
          </div>
        </Card>
      </div>
    </div>

    <!-- Recent Copies Section -->
    {#if copies.length > 0}
      <Card title="Recent Copies">
        <div class="space-y-3">
          {#each copies.slice(0, 5) as copy (copy.id)}
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div>
                <p class="font-mono font-bold text-gray-900">{copy.barcode}</p>
                {#if copy.call_number}
                  <p class="text-sm text-gray-600">Call Number: {copy.call_number}</p>
                {/if}
              </div>
              <span class={`px-3 py-1 rounded-full text-xs font-semibold ${getCopyStatusBadgeColor(copy.status)}`}>
                {copy.status}
              </span>
            </div>
          {/each}

          {#if copies.length > 5}
            <button
              on:click={handleViewCopies}
              class="w-full py-2 text-orange-500 hover:text-orange-600 font-medium transition"
            >
              View all {copies.length} copies →
            </button>
          {/if}
        </div>
      </Card>
    {:else}
      <Card title="Copies">
        <div class="text-center py-8">
          <p class="text-gray-500">No copies available for this book</p>
          <button
            on:click={handleViewCopies}
            class="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Add Copies
          </button>
        </div>
      </Card>
    {/if}
  {:else}
    <Card title="">
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg font-medium">Book not found</p>
      </div>
    </Card>
  {/if}
</div>