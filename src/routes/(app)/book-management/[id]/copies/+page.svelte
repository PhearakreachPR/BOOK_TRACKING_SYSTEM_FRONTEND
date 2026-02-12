<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import CopyRow from '$lib/components/copies/CopyRow.svelte';
  import AddCopiesForm from '$lib/components/books/AddCopiesForm.svelte';
  import { bookService } from '$lib/services/bookService';
  import { bookcopyService } from '$lib/services/bookcopyService';
  import type { Book, BookCopy, CopyStatus } from '$lib/types/book.type';

  let book: Book | null = null;
  let copies: BookCopy[] = [];
  let filteredCopies: BookCopy[] = [];
  let isLoading = true;
  let error = '';
  let searchQuery = '';

  // Modal states
  let showAddCopiesModal = false;
  let showStatusModal = false;
  let statusChangeCopy: BookCopy | null = null;

  // Filter state
  let statusFilter: CopyStatus | 'all' = 'all';

  $: bookId = parseInt($page.params.id);

  onMount(() => {
    loadData();
  });

  async function loadData() {
    try {
      isLoading = true;
      error = '';

      // Load book details
      const bookResponse = await bookService.getBookById(bookId);
      book = bookResponse.data;

      // Load copies
      await loadCopies();
    } catch (err: any) {
      error = err.message || 'Failed to load data';
      console.error('Error loading data:', err);
    } finally {
      isLoading = false;
    }
  }

  async function loadCopies() {
    try {
      const response = await bookcopyService.getCopiesByBookId(bookId, 1, 100);
      
      // Handle response - check if data exists and is an array
      if (response && response.data) {
        copies = Array.isArray(response.data) ? response.data : [];
      } else {
        copies = [];
      }
      
      filteredCopies = copies;
      console.log('Loaded copies:', copies);
    } catch (err: any) {
      error = err.message || 'Failed to load copies';
      copies = [];
      filteredCopies = [];
      console.error('Error loading copies:', err);
    }
  }

  // Filter copies
  $: {
    filteredCopies = copies.filter(copy => {
      // Status filter
      if (statusFilter !== 'all' && copy.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          copy.barcode.toLowerCase().includes(query) ||
          (copy.call_number && copy.call_number.toLowerCase().includes(query)) ||
          (copy.notes && copy.notes.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }

  // Create multiple copies - Backend generates barcodes
  async function handleAddCopies(event: CustomEvent) {
    try {
      // FIXED: event.detail now contains the flat structure from AddCopiesForm
      const formData = event.detail;
      console.log('Creating copies:', formData);
      
      // FIXED: Pass the entire formData object to the service
      await bookcopyService.createMultipleCopies(formData);
      showAddCopiesModal = false;
      await loadCopies();
      
      // Show success message
      alert(`✅ Successfully created ${formData.quantity} ${formData.quantity === 1 ? 'copy' : 'copies'}! Barcodes have been auto-generated.`);
    } catch (err: any) {
      console.error('Error creating copies:', err);
      alert(`❌ Error: ${err.message || 'Failed to add copies'}`);
    }
  }

  async function handleDeleteCopy(copy: BookCopy) {
    if (!confirm(`Are you sure you want to delete copy with barcode "${copy.barcode}"?`)) {
      return;
    }

    try {
      await bookcopyService.deleteCopy(copy.id);
      await loadCopies();
      alert('✅ Copy deleted successfully');
    } catch (err: any) {
      alert(`❌ Error: ${err.message || 'Failed to delete copy'}`);
    }
  }

  async function handleStatusChange(copy: BookCopy, newStatus: CopyStatus) {
    try {
      await bookcopyService.updateCopyStatus(copy.id, newStatus);
      await loadCopies();
      alert('✅ Status updated successfully');
    } catch (err: any) {
      alert(`❌ Error: ${err.message || 'Failed to update status'}`);
    }
  }

  // Event handlers
  function handleDeleteCopyEvent(event: CustomEvent<BookCopy>) {
    handleDeleteCopy(event.detail);
  }

  function handleStatusChangeEvent(event: CustomEvent<BookCopy>) {
    statusChangeCopy = event.detail;
    showStatusModal = true;
  }

  function openAddCopiesModal() {
    showAddCopiesModal = true;
  }

  function closeAddCopiesModal() {
    showAddCopiesModal = false;
  }

  function closeStatusModal() {
    showStatusModal = false;
    statusChangeCopy = null;
  }

  function handleBack() {
    goto(`/book-management/${bookId}`);
  }

  const statusOptions: { value: CopyStatus; label: string }[] = [
    { value: 'available' as CopyStatus, label: 'Available' },
    { value: 'borrowed' as CopyStatus, label: 'Borrowed' },
    { value: 'maintenance' as CopyStatus, label: 'Maintenance' },
    { value: 'lost' as CopyStatus, label: 'Lost' },
    { value: 'damaged' as CopyStatus, label: 'Damaged' }
  ];
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
      Back to Book Details
    </button>
  </div>

  {#if book}
    <!-- Book Info Header -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-8 text-white flex items-center justify-between shadow-lg">
      <div>
        <h1 class="text-4xl font-bold leading-tight">{book.title}</h1>
        <p class="text-orange-100 mt-2 text-lg">by {book.author}</p>
        <p class="text-orange-100 mt-1">Managing {copies.length} {copies.length === 1 ? 'copy' : 'copies'}</p>
      </div>
      <div class="text-8xl opacity-80">📚</div>
    </div>
  {/if}

  <!-- Controls -->
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Search -->
    <div class="flex-1">
      <div class="relative">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by barcode, call number, or notes..."
          class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Status Filter -->
    <select
      bind:value={statusFilter}
      class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="all">All Statuses</option>
      {#each statusOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>

    <!-- Add Copies Button -->
    <button
      on:click={openAddCopiesModal}
      class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg whitespace-nowrap"
    >
      + Add Copies
    </button>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      ❌ {error}
    </div>
  {/if}

  <!-- Copies List -->
  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading copies...</p>
      </div>
    </div>
  {:else if filteredCopies.length === 0}
    <Card title="">
      <div class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600 text-lg">No copies found</p>
        <p class="text-gray-500 mt-2">
          {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Click "+ Add Copies" to get started'}
        </p>
      </div>
    </Card>
  {:else}
    <div class="space-y-4">
      {#each filteredCopies as copy (copy.id)}
        <CopyRow
          {copy}
          showBookInfo={false}
          on:delete={handleDeleteCopyEvent}
          on:statusChange={handleStatusChangeEvent}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Add Copies Modal -->
{#if showAddCopiesModal && book}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <AddCopiesForm
        bookId={book.id}
        bookTitle={book.title}
        on:submit={handleAddCopies}
        on:cancel={closeAddCopiesModal}
      />
    </div>
  </div>
{/if}

<!-- Status Change Modal -->
{#if showStatusModal && statusChangeCopy}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Change Copy Status</h2>
      <p class="text-gray-600 mb-4">Barcode: <span class="font-mono font-bold">{statusChangeCopy.barcode}</span></p>
      
      <div class="space-y-2 mb-6">
        {#each statusOptions as option}
          <button
            on:click={() => {
              handleStatusChange(statusChangeCopy, option.value);
              closeStatusModal();
            }}
            class={`w-full px-4 py-3 rounded-lg font-medium text-left transition ${
              statusChangeCopy.status === option.value
                ? 'bg-orange-100 border-2 border-orange-500 text-orange-700'
                : 'bg-gray-50 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {option.label}
            {#if statusChangeCopy.status === option.value}
              <span class="text-xs ml-2">(Current)</span>
            {/if}
          </button>
        {/each}
      </div>

      <button
        on:click={closeStatusModal}
        class="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Cancel
      </button>
    </div>
  </div>
{/if}