<script>
  import { createEventDispatcher } from 'svelte';
  import authService from '$lib/services/authService';
  
  const dispatch = createEventDispatcher();
  
  export let isOpen = false;
  
  // State management
  let step = 1; // 1: email, 2: OTP, 3: success
  let email = '';
  let otp = '';
  let newPassword = '';
  let confirmPassword = '';
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let useOtpMethod = true; // Toggle between OTP and email link
  
  // Validation
  let errors = {};
  
  function validateEmail() {
    errors = {};
    if (!email || !email.includes('@')) {
      errors.email = 'Please enter a valid email address';
      return false;
    }
    return true;
  }
  
  function validateOtpStep() {
    errors = {};
    
    if (!otp || otp.length !== 6) {
      errors.otp = 'Please enter a valid 6-digit OTP';
    }
    
    if (!newPassword || newPassword.length < 7) {
      errors.newPassword = 'Password must be at least 7 characters';
    }
    
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSendOtp() {
    if (!validateEmail()) return;
    
    isLoading = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const result = await authService.requestResetOtp(email);
      
      if (result.success) {
        successMessage = result.message || 'OTP sent to your email';
        step = 2;
        
        // Clear success message after showing it
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = result.error;
      }
    } catch (error) {
      errorMessage = 'Failed to send OTP. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  async function handleSendEmailLink() {
    if (!validateEmail()) return;
    
    isLoading = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        successMessage = result.message || 'Password reset link sent to your email';
        step = 3;
      } else {
        errorMessage = result.error;
      }
    } catch (error) {
      errorMessage = 'Failed to send reset link. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  async function handleVerifyOtp() {
    if (!validateOtpStep()) return;
    
    isLoading = true;
    errorMessage = '';
    
    try {
      const result = await authService.verifyResetOtp(email, otp, newPassword);
      
      if (result.success) {
        successMessage = result.message || 'Password reset successfully';
        step = 3;
        
        // Close modal and redirect after 2 seconds
        setTimeout(() => {
          handleClose();
          window.location.href = '/auth';
        }, 2000);
      } else {
        errorMessage = result.error;
      }
    } catch (error) {
      errorMessage = 'Failed to reset password. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  function handleClose() {
    step = 1;
    email = '';
    otp = '';
    newPassword = '';
    confirmPassword = '';
    errorMessage = '';
    successMessage = '';
    errors = {};
    dispatch('close');
  }
  
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
  
  function goBack() {
    if (step === 2) {
      step = 1;
      otp = '';
      newPassword = '';
      confirmPassword = '';
      errors = {};
      errorMessage = '';
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    on:click={handleBackdropClick}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center relative">
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
        <h2 class="text-2xl font-bold text-white mb-1">Reset Password</h2>
        <p class="text-blue-100 text-sm">
          {#if step === 1}
            Enter your email to receive a reset code
          {:else if step === 2}
            Enter the OTP sent to your email
          {:else}
            Check your email
          {/if}
        </p>
      </div>

      <!-- Form -->
      <div class="px-6 py-6">
        <!-- Success Message -->
        {#if successMessage}
          <div class="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
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
          <div class="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        {/if}

        {#if step === 1}
          <!-- Step 1: Email Input -->
          <form on:submit|preventDefault={useOtpMethod ? handleSendOtp : handleSendEmailLink} class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                bind:value={email}
                placeholder="Enter your email"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.email ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              {#if errors.email}
                <p class="mt-1 text-sm text-red-600">{errors.email}</p>
              {/if}
            </div>

            <!-- Method Selection -->
            <div class="flex items-center space-x-4 py-2">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  bind:group={useOtpMethod}
                  value={true}
                  class="mr-2"
                  disabled={isLoading}
                />
                <span class="text-sm text-gray-700">Send OTP Code</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  bind:group={useOtpMethod}
                  value={false}
                  class="mr-2"
                  disabled={isLoading}
                />
                <span class="text-sm text-gray-700">Send Email Link</span>
              </label>
            </div>

            <button
              type="submit"
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
              disabled={isLoading}
            >
              {#if isLoading}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              {:else}
                {useOtpMethod ? 'Send OTP' : 'Send Reset Link'}
              {/if}
            </button>
          </form>
        {:else if step === 2}
          <!-- Step 2: OTP and New Password -->
          <form on:submit|preventDefault={handleVerifyOtp} class="space-y-4">
            <div>
              <label for="otp" class="block text-sm font-semibold text-gray-700 mb-2">
                OTP Code <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="otp"
                bind:value={otp}
                placeholder="Enter 6-digit OTP"
                maxlength="6"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.otp ? 'border-red-500' : 'border-gray-300'} text-center text-2xl tracking-widest font-bold"
                disabled={isLoading}
              />
              {#if errors.otp}
                <p class="mt-1 text-sm text-red-600">{errors.otp}</p>
              {/if}
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                New Password <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                bind:value={newPassword}
                placeholder="Enter new password"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.newPassword ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              {#if errors.newPassword}
                <p class="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              {/if}
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                bind:value={confirmPassword}
                placeholder="Confirm new password"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition {errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}"
                disabled={isLoading}
              />
              {#if errors.confirmPassword}
                <p class="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              {/if}
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                on:click={goBack}
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading}
              >
                {#if isLoading}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                {:else}
                  Reset Password
                {/if}
              </button>
            </div>
          </form>
        {:else}
          <!-- Step 3: Success -->
          <div class="text-center py-4">
            <div class="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg class="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
            <p class="text-gray-600 mb-6">
              Please check your email for the password reset link.
            </p>
            <button
              on:click={handleClose}
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Close
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}