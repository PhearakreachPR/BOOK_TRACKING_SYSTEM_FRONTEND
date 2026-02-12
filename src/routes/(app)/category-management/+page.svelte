<script lang="ts">
  import { onMount } from "svelte";
  import Card from "$lib/components/Card.svelte";
  import EditCategoryModal from "$lib/components/Category/EditCategoryModal.svelte";
  import categoryService from "$lib/services/categoryService";
  import { authStore } from '$lib/stores/authStore.js';


  // State
  let categories = [];
  let loading = false;
  let error = null;
  let searchQuery = "";
  let showAddForm = false;

  // Edit modal state
  let showEditModal = false;
  let editingCategory = null;

  // Pagination
  let currentPage = 1;
  let totalPages = 1;
  let totalCategories = 0;
  const limit = 9;

  // Form data for adding new category
  let newCategory = {
    categoryName: "",
    description: "",
    iconType: "preset",
    iconValue: "📚",
    iconFile: null,
  };

  // Preset icons
  const presetIcons = [
    "📚", "📖", "📕", "📗", "📘", "📙", "📓", 
    "📔", "📒", "📑", "🔖", "🏷️", "✏️", "📝",
    "🚀", "💼", "🔬", "🎨", "🎭", "🎪", "🎬"
  ];

  // Check if user is staff
  $: isStaff = $authStore.user?.role === "STAFF";

  // Filtered categories based on search
  $: filteredCategories = searchQuery.trim()
    ? categories.filter(cat => 
        cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  // Load categories on mount
  onMount(async () => {
    await loadCategories();
  });

  /**
   * Load categories from API
   */
  async function loadCategories() {
    loading = true;
    error = null;

    const result = await categoryService.getCategories({
      page: currentPage,
      limit: limit,
    });

    if (result.success) {
      categories = result.data || [];
      if (result.meta) {
        totalPages = result.meta.totalPages || 1;
        totalCategories = result.meta.total || 0;
      }
    } else {
      error = result.error;
      categories = [];
    }

    loading = false;
  }

  /**
   * Add new category
   */
  async function addCategory() {
    if (!newCategory.categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (newCategory.iconType === "preset" && !newCategory.iconValue) {
      alert("Please select an icon");
      return;
    }

    if (newCategory.iconType === "custom" && !newCategory.iconFile) {
      alert("Please upload an icon file");
      return;
    }

    loading = true;
    const result = await categoryService.createCategory(newCategory);

    if (result.success) {
      alert(result.message || "Category created successfully!");
      
      // Reset form
      newCategory = {
        categoryName: "",
        description: "",
        iconType: "preset",
        iconValue: "📚",
        iconFile: null,
      };
      showAddForm = false;
      
      // Reload categories
      await loadCategories();
    } else {
      alert(`Error: ${result.error}`);
    }

    loading = false;
  }

  /**
   * Open edit modal
   */
  function openEditModal(category) {
    editingCategory = category;
    showEditModal = true;
  }

  /**
   * Handle edit modal save
   */
  async function handleEditSave(event) {
    const { categoryId, updateData, iconFile } = event.detail;
    
    loading = true;
    
    // If there's a file upload and icon type is custom, handle it separately
    if (iconFile) {
      // For now, we'll use the update endpoint
      // You might need to create a separate endpoint for file uploads in updates
      const formData = new FormData();
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && updateData[key] !== null) {
          formData.append(key, updateData[key]);
        }
      });
      formData.append('icon', iconFile);
      
      // TODO: Use a specialized update endpoint that handles file uploads
      // For now, just update the text fields
    }
    
    const result = await categoryService.updateCategory(categoryId, updateData);

    if (result.success) {
      alert(result.message || "Category updated successfully!");
      showEditModal = false;
      editingCategory = null;
      await loadCategories();
    } else {
      alert(`Error: ${result.error}`);
    }

    loading = false;
  }

  /**
   * Handle edit modal cancel
   */
  function handleEditCancel() {
    showEditModal = false;
    editingCategory = null;
  }

  /**
   * Delete category
   */
  async function deleteCategory(categoryId, categoryName) {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    loading = true;
    const result = await categoryService.deleteCategory(categoryId);

    if (result.success) {
      alert(result.message || "Category deleted successfully!");
      await loadCategories();
    } else {
      alert(`Error: ${result.error}`);
    }

    loading = false;
  }

  /**
   * Handle icon file upload for new category
   */
  function handleIconUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        event.target.value = '';
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        event.target.value = '';
        return;
      }
      
      newCategory.iconFile = file;
    }
  }

  /**
   * Get icon display for a category
   */
  function getCategoryIcon(category) {
    if (category.iconType === 'preset' && category.iconValue) {
      return { type: 'emoji', value: category.iconValue };
    } else if (category.iconType === 'custom' && category.iconValue) {
      return { type: 'image', value: category.iconValue };
    }
    return { type: 'emoji', value: '📚' }; // Default icon
  }

  /**
   * Pagination handlers
   */
  function goToPage(page) {
    currentPage = page;
    loadCategories();
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      loadCategories();
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      loadCategories();
    }
  }
</script>

<!-- Edit Category Modal -->
<EditCategoryModal
  bind:show={showEditModal}
  category={editingCategory}
  on:save={handleEditSave}
  on:cancel={handleEditCancel}
/>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Category Management</h1>
      <p class="text-gray-600 mt-1">
        {totalCategories} {totalCategories === 1 ? 'category' : 'categories'} total
      </p>
    </div>
    
    {#if isStaff}
      <button
        on:click={() => (showAddForm = !showAddForm)}
        disabled={loading}
        class="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Category
      </button>
    {/if}
  </div>

  <!-- Error Display -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  <!-- Add Category Form -->
  {#if showAddForm && isStaff}
    <Card title="">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800">Add New Category</h2>
          <button
            on:click={() => (showAddForm = false)}
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Icon Type Selection -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Icon Type</label>
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={newCategory.iconType}
                value="preset"
                class="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500"
              />
              <span class="text-gray-700">Preset Icon</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={newCategory.iconType}
                value="custom"
                class="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500"
              />
              <span class="text-gray-700">Custom Upload</span>
            </label>
          </div>
        </div>

        <!-- Preset Icon Selection -->
        {#if newCategory.iconType === "preset"}
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Select Icon</label>
            <div class="grid grid-cols-7 gap-2">
              {#each presetIcons as icon}
                <button
                  type="button"
                  on:click={() => (newCategory.iconValue = icon)}
                  class="text-3xl p-3 rounded-lg border-2 transition hover:scale-110 {newCategory.iconValue === icon ? 'border-orange-500 bg-orange-50 scale-110' : 'border-gray-200 hover:border-gray-300'}"
                >
                  {icon}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Custom Icon Upload -->
        {#if newCategory.iconType === "custom"}
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Upload Icon</label>
            <input
              type="file"
              accept="image/*"
              on:change={handleIconUpload}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <p class="text-xs text-gray-500 mt-1">Max size: 2MB. Formats: JPG, PNG, GIF, WebP</p>
          </div>
        {/if}

        <!-- Category Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Category Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            bind:value={newCategory.categoryName}
            placeholder="e.g., Science Fiction, History, Programming..."
            maxlength="100"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            bind:value={newCategory.description}
            placeholder="Brief description of this category..."
            rows="3"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white resize-none"
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-2 pt-2">
          <button
            on:click={addCategory}
            disabled={loading}
            class="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
          <button
            on:click={() => (showAddForm = false)}
            disabled={loading}
            class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
      placeholder="Search categories by name or description..."
      bind:value={searchQuery}
      disabled={loading}
      class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>

  <!-- Loading State -->
  {#if loading}
    <div class="flex justify-center items-center py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading categories...</p>
      </div>
    </div>
  {:else if filteredCategories.length === 0}
    <!-- Empty State -->
    <div class="text-center py-16 bg-gray-50 rounded-lg">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
      <p class="mt-2 text-sm text-gray-500">
        {#if searchQuery}
          No categories match your search "{searchQuery}"
        {:else}
          Get started by creating your first category
        {/if}
      </p>
    </div>
  {:else}
    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredCategories as category (category.category_id)}
        {@const categoryIcon = getCategoryIcon(category)}
        <Card title="">
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <!-- Display Icon -->
                <div class="flex-shrink-0">
                  {#if categoryIcon.type === 'emoji'}
                    <div class="text-4xl">{categoryIcon.value}</div>
                  {:else}
                    <img 
                      src={categoryIcon.value} 
                      alt="{category.categoryName} icon" 
                      class="w-12 h-12 object-cover rounded-lg"
                      on:error={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-4xl">📚</div>';
                      }}
                    />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-gray-900 truncate">{category.categoryName}</h3>
                  {#if category.description}
                    <p class="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  {/if}
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
              <p class="text-sm text-gray-600 font-medium">Books in Category</p>
              <p class="text-2xl font-bold text-orange-600">
                {category.books?.length || 0}
              </p>
            </div>

            <div class="flex gap-2 pt-2 border-t border-gray-100">
              <a
                href="/category-management/{category.category_id}/books"
                class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-center text-sm"
              >
                View Books
              </a>
              
              {#if isStaff}
                <button
                  on:click={() => openEditModal(category)}
                  disabled={loading}
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit category"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  on:click={() => deleteCategory(category.category_id, category.categoryName)}
                  disabled={loading}
                  class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete category"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              {/if}
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex justify-center items-center gap-2 mt-8">
        <button
          on:click={previousPage}
          disabled={currentPage === 1 || loading}
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        <div class="flex gap-1">
          {#each Array(Math.min(totalPages, 7)) as _, i}
            {@const pageNum = i + 1}
            <button
              on:click={() => goToPage(pageNum)}
              disabled={loading}
              class="px-3 py-2 rounded-lg transition font-medium {currentPage === pageNum ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pageNum}
            </button>
          {/each}
          {#if totalPages > 7}
            <span class="px-3 py-2">...</span>
          {/if}
        </div>
        
        <button
          on:click={nextPage}
          disabled={currentPage === totalPages || loading}
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <p class="text-center text-sm text-gray-600 mt-4">
        Page {currentPage} of {totalPages} • {totalCategories} total categories
      </p>
    {/if}
  {/if}
</div>