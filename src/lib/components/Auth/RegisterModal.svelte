<script>
  import { createEventDispatcher } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  const dispatch = createEventDispatcher();
  
  export let isOpen = false;
  
  let formData = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  };
  
  let showPassword = false;
  let showConfirmPassword = false;
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let errors = {};
  
  function togglePasswordVisibility(field) {
    if (field === 'password') {
      showPassword = !showPassword;
    } else {
      showConfirmPassword = !showConfirmPassword;
    }
  }
  
  function validateForm() {
    errors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone must be in format: +855123456789';
    }
    
    if (!formData.password || formData.password.length < 7) {
      errors.password = 'Password must be at least 7 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleRegister() {
    errorMessage = '';
    successMessage = '';
    
    if (!validateForm()) {
      return;
    }
    
    isLoading = true;
    
    try {
      const result = await authStore.register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      
      if (result.success) {
        successMessage = 'Registration successful! Please check your email to verify your account.';
        
        if (result.needsEmailVerification) {
          // Redirect to email verification page/modal
          goto('/email-verification');
        } else {
          // Already verified (shouldn't happen for new users)
          goto('/dashboard');
        }
      } else {
        errorMessage = result.error || 'Registration failed. Please try again.';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  function navigateToLogin() {
    dispatch('navigate', 'login');
  }
  
  function handleClose() {
    formData = {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    };
    errors = {};
    errorMessage = '';
    successMessage = '';
    showPassword = false;
    showConfirmPassword = false;
    dispatch('close');
  }
  
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
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center relative">
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p class="text-blue-100 text-sm">Join ITC Library System</p>
      </div>

      <!-- Form -->
      <div class="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <form on:submit|preventDefault={handleRegister} class="space-y-4">
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

          <!-- Full Name -->
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              placeholder="John Doe"
              class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.name ? 'border-red-500' : 'border-gray-300'}"
              disabled={isLoading}
            />
            {#if errors.name}
              <p class="mt-1 text-xs text-red-600">{errors.name}</p>
            {/if}
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              placeholder="user@example.com"
              class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.email ? 'border-red-500' : 'border-gray-300'}"
              disabled={isLoading}
            />
            {#if errors.email}
              <p class="mt-1 text-xs text-red-600">{errors.email}</p>
            {/if}
          </div>

          <!-- Phone Number -->
          <div>
            <label for="phoneNumber" class="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              bind:value={formData.phoneNumber}
              placeholder="+855123456789"
              class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}"
              disabled={isLoading}
            />
            {#if errors.phoneNumber}
              <p class="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
            {:else}
              <p class="mt-1 text-xs text-gray-500">Format: +855123456789</p>
            {/if}
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                bind:value={formData.password}
                placeholder="Min. 7 characters"
                class="w-full px-4 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.password ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              <button
                type="button"
                on:click={() => togglePasswordVisibility('password')}
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {#if showPassword}
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
            {#if errors.password}
              <p class="mt-1 text-xs text-red-600">{errors.password}</p>
            {/if}
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                bind:value={formData.confirmPassword}
                placeholder="Re-enter password"
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

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            {:else}
              Create Account
            {/if}
          </button>

          <div class="text-center pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Already have an account?
              <button
                type="button"
                on:click={navigateToLogin}
                class="text-blue-600 hover:text-blue-700 font-semibold ml-1"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}