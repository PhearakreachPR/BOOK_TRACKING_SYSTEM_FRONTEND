<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import authService from '$lib/services/authService';
  
  export let token = '';
  
  let isLoading = true;
  let isSuccess = false;
  let errorMessage = '';
  let email = '';
  
  onMount(async () => {
    if (token) {
      await confirmEmail();
    } else {
      isLoading = false;
      errorMessage = 'No confirmation token provided';
    }
  });
  
  async function confirmEmail() {
    isLoading = true;
    errorMessage = '';
    
    try {
      const result = await authService.confirmEmail(token);
      
      if (result.success) {
        isSuccess = true;
        email = result.email || '';
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          goto('/auth');
        }, 3000);
      } else {
        errorMessage = result.error || 'Failed to confirm email';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred';
    } finally {
      isLoading = false;
    }
  }
  
  function goToLogin() {
    goto('/auth');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
    {#if isLoading}
      <!-- Loading State -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
        <div class="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-3">
          <svg class="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-1">Verifying Email</h2>
        <p class="text-blue-100 text-sm">Please wait...</p>
      </div>

      <div class="px-6 py-6">
        <div class="flex flex-col items-center justify-center py-6">
          <svg class="animate-spin h-10 w-10 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-gray-600 text-center">Verifying your email address...</p>
        </div>
      </div>
    {:else if isSuccess}
      <!-- Success State -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
        <div class="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-3">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-1">Email Verified!</h2>
        <p class="text-blue-100 text-sm">Your account has been activated</p>
      </div>

      <div class="px-6 py-6">
        <div class="space-y-4">
          <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-green-700 font-medium">
                {#if email}
                  Email <span class="font-semibold">{email}</span> verified successfully!
                {:else}
                  Email verified successfully!
                {/if}
              </p>
            </div>
          </div>

          <div class="text-center py-4">
            <p class="text-gray-600 mb-2">You can now log in to your account</p>
            <p class="text-sm text-gray-500 mb-4">
              You will be redirected to the login page in a few seconds...
            </p>
            <button
              on:click={goToLogin}
              class="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    {:else}
      <!-- Error State -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
        <div class="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full mb-3">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-1">Verification Failed</h2>
        <p class="text-blue-100 text-sm">Unable to verify your email</p>
      </div>

      <div class="px-6 py-6">
        <div class="space-y-4">
          {#if errorMessage}
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
            </div>
          {/if}

          <div class="space-y-3">
            <button
              on:click={confirmEmail}
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Try Again
            </button>
            <button
              on:click={goToLogin}
              class="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>