<script lang="ts">
  import type { BookCopy } from '../../types/book.type';
  import { createEventDispatcher } from 'svelte';
  import BarcodeView from './BarcodeView.svelte';

  export let copy: BookCopy;
  export let showActions = true;
  export let showBookInfo = true;

  const dispatch = createEventDispatcher();

  let showBarcode = false;

  function getStatusBadgeColor(status: string): string {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      borrowed: 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      lost: 'bg-red-100 text-red-800 border-red-200',
      damaged: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  function getStatusIcon(status: string): string {
    const icons = {
      available: '✓',
      borrowed: '📖',
      maintenance: '🔧',
      lost: '❌',
      damaged: '⚠️'
    };
    return icons[status as keyof typeof icons] || '•';
  }

  function formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function handleEdit() {
    dispatch('edit', copy);
  }

  function handleDelete() {
    dispatch('delete', copy);
  }

  function handleStatusChange() {
    dispatch('statusChange', copy);
  }

  function toggleBarcode() {
    showBarcode = !showBarcode;
  }
</script>

<div class="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
  <div class="p-4">
    <!-- Main Info Row -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <!-- Barcode -->
        <div class="flex items-center gap-3 mb-3">
          <button
            on:click={toggleBarcode}
            class="font-mono font-bold text-lg text-gray-900 hover:text-orange-500 transition"
            title="Click to show/hide barcode"
          >
            {copy.barcode}
          </button>
          <span class={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(copy.status)}`}>
            {getStatusIcon(copy.status)} {copy.status}
          </span>
        </div>

        <!-- Book Info -->
        {#if showBookInfo && copy.book}
          <div class="mb-3">
            <p class="font-semibold text-gray-900 mb-1">{copy.book.title}</p>
            <p class="text-sm text-gray-600">by {copy.book.author}</p>
          </div>
        {/if}

        <!-- Details Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {#if copy.call_number}
            <div>
              <p class="text-gray-500 font-medium">Call Number</p>
              <p class="font-semibold text-gray-900">{copy.call_number}</p>
            </div>
          {/if}

          <div>
            <p class="text-gray-500 font-medium">Acquired</p>
            <p class="font-semibold text-gray-900">{formatDate(copy.acquisition_date)}</p>
          </div>

          <div>
            <p class="text-gray-500 font-medium">Added to System</p>
            <p class="font-semibold text-gray-900">{formatDate(copy.createdAt)}</p>
          </div>

          {#if copy.notes}
            <div class="col-span-2 md:col-span-1">
              <p class="text-gray-500 font-medium">Notes</p>
              <p class="text-sm text-gray-700 italic">{copy.notes}</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Actions -->
      {#if showActions}
        <div class="flex gap-2 flex-shrink-0">
          <button
            on:click={handleStatusChange}
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Change status"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            on:click={handleEdit}
            class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            title="Edit copy"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            on:click={handleDelete}
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete copy"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      {/if}
    </div>

    <!-- Barcode Display -->
    {#if showBarcode}
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex justify-center">
          <BarcodeView barcode={copy.barcode} />
        </div>
      </div>
    {/if}
  </div>
</div>