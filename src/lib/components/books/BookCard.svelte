<script lang="ts">
  import type { Book } from '../../types/book.type';
  import { createEventDispatcher } from 'svelte';

  export let book: Book;
  export let showActions = true;

  const dispatch = createEventDispatcher();

  function getStatusBadgeColor(status: string): string {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      reference: 'bg-blue-100 text-blue-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  function handleView() {
    dispatch('view', book);
  }

  function handleEdit() {
    dispatch('edit', book);
  }

  function handleDelete() {
    dispatch('delete', book);
  }

  function handleViewCopies() {
    dispatch('viewCopies', book);
  }
</script>

<div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
  <!-- Book Header -->
  <div class="p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p class="text-gray-600 font-medium mb-2">
          by {book.author}
        </p>
      </div>
      <span class={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(book.status)}`}>
        {book.status}
      </span>
    </div>

    <!-- Book Details -->
    <div class="space-y-2 mb-4">
      {#if book.isbn}
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <span class="font-mono">{book.isbn}</span>
        </div>
      {/if}

      {#if book.category}
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{book.category.name}</span>
        </div>
      {/if}

      {#if book.copies}
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          <span>{book.copies.length} {book.copies.length === 1 ? 'copy' : 'copies'}</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Actions -->
  {#if showActions}
    <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
      <div class="flex gap-2">
        <button
          on:click={handleView}
          class="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
        >
          View Details
        </button>
        <button
          on:click={handleViewCopies}
          class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium text-sm"
        >
          View Copies
        </button>
        <button
          on:click={handleEdit}
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          title="Edit book"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          on:click={handleDelete}
          class="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
          title="Delete book"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  {/if}
</div>