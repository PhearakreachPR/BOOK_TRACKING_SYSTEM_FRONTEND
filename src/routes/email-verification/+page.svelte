<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import authService from '$lib/services/authService';
  
  let user = null;
  let isResending = false;
  let resendMessage = '';
  let resendError = '';
  let countdown = 3;
  let showCountdown = false;
  
  onMount(() => {
    const unsubscribe = authStore.subscribe(state => {
      user = state.user;
      
      // If already verified, redirect to dashboard
      if (user?.isEmailConfirmed) {
        goto('/dashboard');
      }
    });
    
    return unsubscribe;
  });
  
  async function handleResendEmail() {
    isResending = true;
    resendMessage = '';
    resendError = '';
    
    try {
      const result = await authService.resendVerificationEmail();
      
      if (result.success) {
        resendMessage = 'Verification email sent! Please check your inbox.';
      } else {
        resendError = result.error || 'Failed to send email. Please try again.';
      }
    } catch (error) {
      resendError = 'An error occurred. Please try again.';
    } finally {
      isResending = false;
    }
  }
  
  function handleSkip() {
    // Mark that user chose to skip (optional - for analytics)
    localStorage.setItem('emailVerificationSkipped', 'true');
    
    // Show countdown before redirect
    showCountdown = true;
    countdown = 3;
    
    const interval = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        clearInterval(interval);
        goto('/dashboard');
      }
    }, 1000);
  }
  
  function handleVerifyNow() {
    // User wants to verify - keep them on this page
    // They'll need to click the link in their email
    resendMessage = 'Please check your email and click the verification link.';
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
  <div class="max-w-md w-full">
    <!-- Main Card -->
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
        <div class="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-4">
          <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
        <p class="text-blue-100">We've sent a verification link to</p>
        <p class="text-white font-semibold mt-1">{user?.email}</p>
      </div>

      <!-- Content -->
      <div class="px-8 py-8">
        {#if showCountdown}
          <!-- Countdown -->
          <div class="text-center mb-6">
            <div class="inline-block p-4 bg-green-50 rounded-full mb-3">
              <svg class="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Redirecting to Dashboard</h3>
            <p class="text-gray-600">You'll be redirected in <span class="text-2xl font-bold text-blue-600">{countdown}</span> second{countdown !== 1 ? 's' : ''}...</p>
          </div>
        {:else}
          <!-- Instructions -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">What's next?</h3>
            <ol class="space-y-3">
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                <p class="text-gray-700 pt-0.5">Check your email inbox (and spam folder)</p>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                <p class="text-gray-700 pt-0.5">Click the verification link in the email</p>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                <p class="text-gray-700 pt-0.5">Return here or your dashboard to continue</p>
              </li>
            </ol>
          </div>

          <!-- Messages -->
          {#if resendMessage}
            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-green-700">{resendMessage}</p>
              </div>
            </div>
          {/if}

          {#if resendError}
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-red-700">{resendError}</p>
              </div>
            </div>
          {/if}

          <!-- Didn't receive email? -->
          <div class="text-center mb-6">
            <p class="text-gray-600 text-sm mb-3">Didn't receive the email?</p>
            <button
              on:click={handleResendEmail}
              disabled={isResending}
              class="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Primary: Verify Now -->
            <button
              on:click={handleVerifyNow}
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              I'll Verify Now
            </button>

            <!-- Secondary: Skip for Now -->
            <button
              on:click={handleSkip}
              class="w-full px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Skip for Now
            </button>
          </div>

          <!-- Info Note -->
          <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm text-blue-800 font-medium mb-1">Why verify?</p>
                <p class="text-sm text-blue-700">Email verification helps secure your account and enables password recovery. You can verify anytime from your profile.</p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Alternative: Close and go to dashboard -->
    {#if !showCountdown}
      <div class="text-center mt-6">
        <button
          on:click={() => goto('/dashboard')}
          class="text-gray-600 hover:text-gray-800 text-sm font-medium hover:underline"
        >
          Close and go to Dashboard →
        </button>
      </div>
    {/if}
  </div>
</div>