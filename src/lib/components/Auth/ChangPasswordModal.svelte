<script>
  import { createEventDispatcher } from 'svelte';
  import authService from '$lib/services/authService';
  
  const dispatch = createEventDispatcher();
  
  export let isOpen = false;
  
  let formData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  let showCurrentPassword = false;
  let showNewPassword = false;
  let showConfirmPassword = false;
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let errors = {};
  
  function togglePasswordVisibility(field) {
    if (field === 'current') {
      showCurrentPassword = !showCurrentPassword;
    } else if (field === 'new') {
      showNewPassword = !showNewPassword;
    } else {
      showConfirmPassword = !showConfirmPassword;
    }
  }
  
  function validateForm() {
    errors = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword || formData.newPassword.length < 7) {
      errors.newPassword = 'New password must be at least 7 characters';
    }
    
    if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleChangePassword() {
    errorMessage = '';
    successMessage = '';
    
    if (!validateForm()) {
      return;
    }
    
    isLoading = true;
    
    try {
      const result = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      
      if (result.success) {
        successMessage = 'Password changed successfully!';
        
        // Reset form
        formData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        // Close modal after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        errorMessage = result.error;
      }
      
    } catch (error) {
      errorMessage = 'Failed to change password. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  function handleClose() {
    // Reset form and errors
    formData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    errors = {};
    errorMessage = '';
    successMessage = '';
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
    
    dispatch('close');
  }
  
  // Close modal when clicking outside
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
    on:click={handleBackdropClick}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 overflow-hidden"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center relative">
        <!-- Close Button -->
        <button
          type="button"
          on:click={handleClose}
          class="absolute top-4 right-4 text-white/80 hover:text-white transition"
          disabled={isLoading}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-3">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-1">Change Password</h2>
        <p class="text-blue-100 text-sm">Update your account password</p>
      </div>

      <!-- Form -->
      <div class="px-6 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        <form on:submit|preventDefault={handleChangePassword} class="space-y-4">
          <!-- Success Message -->
          {#if successMessage}
            <div class="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          {/if}

          <!-- Error Message -->
          {#if errorMessage}
            <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          {/if}

          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              Current Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                bind:value={formData.currentPassword}
                placeholder="Enter current password"
                class="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.currentPassword ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              <button
                type="button"
                on:click={() => togglePasswordVisibility('current')}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {#if showCurrentPassword}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                {/if}
              </button>
            </div>
            {#if errors.currentPassword}
              <p class="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
            {/if}
          </div>

          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              New Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                bind:value={formData.newPassword}
                placeholder="Min. 7 characters"
                class="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.newPassword ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              <button
                type="button"
                on:click={() => togglePasswordVisibility('new')}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {#if showNewPassword}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                {/if}
              </button>
            </div>
            {#if errors.newPassword}
              <p class="mt-1 text-xs text-red-600">{errors.newPassword}</p>
            {/if}
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                bind:value={formData.confirmPassword}
                placeholder="Re-enter new password"
                class="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              <button
                type="button"
                on:click={() => togglePasswordVisibility('confirm')}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {#if showConfirmPassword}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                {/if}
              </button>
            </div>
            {#if errors.confirmPassword}
              <p class="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            {/if}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {#if isLoading}
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Changing Password...
            {:else}
              Change Password
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}