<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Book, CreateBookDto, UpdateBookDto, BookStatus } from '../../types/book.type';

  export let book: Book | null = null;
  export let isEditing = false;

  const dispatch = createEventDispatcher();

  let formData: CreateBookDto | UpdateBookDto = {
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    status: book?.status || 'active',
    category_id: book?.category_id || undefined
  };

  let errors: Record<string, string> = {};
  let isSubmitting = false;

  const statusOptions: { value: BookStatus; label: string }[] = [
    { value: 'active' as BookStatus, label: 'Active' },
    { value: 'inactive' as BookStatus, label: 'Inactive' },
    { value: 'reference' as BookStatus, label: 'Reference' },
    { value: 'archived' as BookStatus, label: 'Archived' }
  ];

  function validateForm(): boolean {
    errors = {};

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must be less than 255 characters';
    }

    if (!formData.author?.trim()) {
      errors.author = 'Author is required';
    } else if (formData.author.length > 255) {
      errors.author = 'Author must be less than 255 characters';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;
    try {
      dispatch('submit', formData);
    } finally {
      isSubmitting = false;
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="bg-white rounded-lg shadow-sm">
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Title -->
    <div>
      <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="title"
        bind:value={formData.title}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Enter book title"
        disabled={isSubmitting}
      />
      {#if errors.title}
        <p class="mt-1 text-sm text-red-600">{errors.title}</p>
      {/if}
    </div>

    <!-- Author -->
    <div>
      <label for="author" class="block text-sm font-semibold text-gray-700 mb-2">
        Author <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="author"
        bind:value={formData.author}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Enter author name"
        disabled={isSubmitting}
      />
      {#if errors.author}
        <p class="mt-1 text-sm text-red-600">{errors.author}</p>
      {/if}
    </div>

    <!-- ISBN -->
    <div>
      <label for="isbn" class="block text-sm font-semibold text-gray-700 mb-2">
        ISBN
      </label>
      <input
        type="text"
        id="isbn"
        bind:value={formData.isbn}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Enter ISBN (optional)"
        disabled={isSubmitting}
      />
    </div>

    <!-- Status -->
    <div>
      <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">
        Status
      </label>
      <select
        id="status"
        bind:value={formData.status}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        disabled={isSubmitting}
      >
        {#each statusOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <!-- Category ID -->
    <div>
      <label for="category_id" class="block text-sm font-semibold text-gray-700 mb-2">
        Category ID
      </label>
      <input
        type="number"
        id="category_id"
        bind:value={formData.category_id}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Enter category ID (optional)"
        disabled={isSubmitting}
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Book' : 'Create Book'}
      </button>
      <button
        type="button"
        on:click={handleCancel}
        disabled={isSubmitting}
        class="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </div>
  </form>
</div>