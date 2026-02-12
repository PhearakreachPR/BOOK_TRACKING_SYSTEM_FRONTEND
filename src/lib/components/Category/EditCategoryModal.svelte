<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let category = null;
  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  // Form state
  let formData = {
    categoryName: '',
    description: '',
    iconType: 'preset',
    iconValue: '📚',
    iconFile: null,
  };
  
  let loading = false;
  let errors = {};
  let fileInput;
  
  // Preset icons
  const presetIcons = [
    "📚", "📖", "📕", "📗", "📘", "📙", "📓", 
    "📔", "📒", "📑", "🔖", "🏷️", "✏️", "📝",
    "🚀", "💼", "🔬", "🎨", "🎭", "🎪", "🎬",
    "⚽", "🏀", "🎮", "🎵", "🎸", "📱", "💻"
  ];
  
  // Initialize form when category changes
  $: if (category && show) {
    formData = {
      categoryName: category.categoryName || '',
      description: category.description || '',
      iconType: category.iconType || 'preset',
      iconValue: category.iconValue || '📚',
      iconFile: null,
    };
    errors = {};
  }
  
  // Check if button should be disabled - FIXED
  $: hasErrors = Object.keys(errors).some(key => errors[key] !== '' && errors[key] !== null && errors[key] !== undefined);
  $: isDisabled = loading || hasErrors;
  
  /**
   * Validate form
   */
  function validateForm() {
    const newErrors = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    } else if (formData.categoryName.length > 100) {
      newErrors.categoryName = 'Category name must be less than 100 characters';
    }
    
    if (formData.iconType === 'preset' && !formData.iconValue) {
      newErrors.icon = 'Please select an icon';
    }
    
    if (formData.iconType === 'custom' && !formData.iconFile && !category?.iconValue) {
      newErrors.icon = 'Please upload an icon file';
    }
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  /**
   * Handle file upload
   */
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors = { ...errors, icon: 'Please upload an image file' };
        event.target.value = '';
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        errors = { ...errors, icon: 'File size must be less than 2MB' };
        event.target.value = '';
        return;
      }
      
      formData.iconFile = file;
      // Clear icon error
      const { icon, ...rest } = errors;
      errors = rest;
    }
  }
  
  /**
   * Handle icon click
   */
  function handleIconClick(icon) {
    formData.iconValue = icon;
    // Clear icon error
    const { icon: iconError, ...rest } = errors;
    errors = rest;
  }
  
  /**
   * Handle form submission
   */
  function handleSubmit() {
    if (!validateForm()) {
      return;
    }
    
    loading = true;
    
    // Prepare update data
    const updateData = {
      categoryName: formData.categoryName.trim(),
    };
    
    // Only include description if it has changed
    if (formData.description !== category.description) {
      updateData.description = formData.description?.trim() || null;
    }
    
    // Only include icon changes if icon type or value changed
    if (formData.iconType !== category.iconType) {
      updateData.iconType = formData.iconType;
    }
    
    if (formData.iconType === 'preset' && formData.iconValue !== category.iconValue) {
      updateData.iconValue = formData.iconValue;
    }
    
    // Dispatch save event with update data and file
    dispatch('save', {
      categoryId: category.category_id,
      updateData,
      iconFile: formData.iconFile,
    });
    
    loading = false;
  }
  
  /**
   * Handle cancel
   */
  function handleCancel() {
    dispatch('cancel');
    errors = {};
  }
  
  /**
   * Handle keyboard events
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && show) {
      handleCancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 9998; background-color: rgba(0, 0, 0, 0.5);"
    on:click={(e) => e.target === e.currentTarget && handleCancel()}
    on:keydown={(e) => e.key === 'Escape' && handleCancel()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
      style="z-index: 9999; max-height: 90vh; display: flex; flex-direction: column;"
      on:click|stopPropagation
      role="document"
    >
      <!-- Header -->
      <div class="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Edit Category</h2>
            <p class="text-sm text-gray-600 mt-1">Update category information</p>
          </div>
          <button
            type="button"
            on:click={handleCancel}
            disabled={loading}
            class="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Category Name -->
        <div>
          <label for="categoryName" class="block text-sm font-semibold text-gray-700 mb-2">
            Category Name <span class="text-red-500">*</span>
          </label>
          <input
            id="categoryName"
            type="text"
            bind:value={formData.categoryName}
            maxlength="100"
            placeholder="e.g., Science Fiction, History..."
            disabled={loading}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
            class:border-red-500={errors.categoryName}
          />
          {#if errors.categoryName}
            <p class="mt-1 text-sm text-red-600">{errors.categoryName}</p>
          {/if}
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            bind:value={formData.description}
            rows="3"
            placeholder="Brief description of this category..."
            disabled={loading}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:opacity-50 disabled:bg-gray-50"
          ></textarea>
        </div>

        <!-- Icon Type Selection -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">Icon Type</label>
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={formData.iconType}
                value="preset"
                disabled={loading}
                class="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 disabled:opacity-50"
              />
              <span class="text-gray-700 font-medium">Preset Icon</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={formData.iconType}
                value="custom"
                disabled={loading}
                class="mr-2 w-4 h-4 text-orange-500 focus:ring-orange-500 disabled:opacity-50"
              />
              <span class="text-gray-700 font-medium">Custom Upload</span>
            </label>
          </div>
        </div>

        <!-- Preset Icon Selection -->
        {#if formData.iconType === 'preset'}
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Select Icon <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-7 gap-2">
              {#each presetIcons as icon}
                <button
                  type="button"
                  on:click={() => handleIconClick(icon)}
                  disabled={loading}
                  class="text-3xl p-3 rounded-lg border-2 transition hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed {formData.iconValue === icon ? 'border-orange-500 bg-orange-50 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-300'}"
                >
                  {icon}
                </button>
              {/each}
            </div>
            {#if errors.icon}
              <p class="mt-2 text-sm text-red-600">{errors.icon}</p>
            {/if}
          </div>
        {/if}

        <!-- Custom Icon Upload -->
        {#if formData.iconType === 'custom'}
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Upload Icon {!category?.iconValue ? '<span class="text-red-500">*</span>' : ''}
            </label>
            
            <!-- Current Icon Preview (if exists) -->
            {#if category?.iconType === 'custom' && category?.iconValue && !formData.iconFile}
              <div class="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-xs text-gray-600 mb-2 font-medium">Current Icon:</p>
                <img 
                  src={category.iconValue} 
                  alt="Current icon" 
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <p class="text-xs text-gray-500 mt-2">Upload a new file to replace</p>
              </div>
            {/if}
            
            <input
              type="file"
              accept="image/*"
              on:change={handleFileChange}
              bind:this={fileInput}
              disabled={loading}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
              class:border-red-500={errors.icon}
            />
            <p class="text-xs text-gray-500 mt-2">Max size: 2MB. Formats: JPG, PNG, GIF, WebP</p>
            {#if errors.icon}
              <p class="mt-1 text-sm text-red-600">{errors.icon}</p>
            {/if}
          </div>
        {/if}

        <!-- Change Summary -->
        {#if category && (formData.categoryName !== category.categoryName || formData.description !== category.description || formData.iconType !== category.iconType || (formData.iconType === 'preset' && formData.iconValue !== category.iconValue) || formData.iconFile)}
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-blue-900 mb-1">Changes to be saved:</h4>
                <ul class="text-xs text-blue-700 space-y-1">
                  {#if formData.categoryName !== category.categoryName}
                    <li>• Name: "{category.categoryName}" → "{formData.categoryName}"</li>
                  {/if}
                  {#if formData.description !== category.description}
                    <li>• Description updated</li>
                  {/if}
                  {#if formData.iconType !== category.iconType || (formData.iconType === 'preset' && formData.iconValue !== category.iconValue) || formData.iconFile}
                    <li>• Icon updated</li>
                  {/if}
                </ul>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Fixed Footer -->
      <div class="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            on:click={handleCancel}
            disabled={loading}
            class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            on:click={handleSubmit}
            disabled={isDisabled}
            class="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {#if loading}
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            {:else}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}