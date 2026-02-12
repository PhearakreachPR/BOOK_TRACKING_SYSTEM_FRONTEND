<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Card from "$lib/components/Card.svelte";
  import StatCard from "$lib/components/StatCard.svelte";
  import WeeklyChart from "$lib/components/WeeklyChart.svelte";
  import MonthlyChart from "$lib/components/MonthlyChart.svelte";
  import { authStore } from '$lib/stores/authStore';
  import authService from '$lib/services/authService';
  
  let user = null;
  let showBanner = false;
  let bannerDismissed = false;
  let isResending = false;
  let resendMessage = '';
  
  onMount(() => {
    const unsubscribe = authStore.subscribe(state => {
      user = state.user;
      
      // Check if banner was previously dismissed (session storage)
      const dismissed = sessionStorage.getItem('emailBannerDismissed');
      
      // Show banner if email not verified and user hasn't dismissed it this session
      showBanner = user && !user.isEmailConfirmed && !dismissed;
    });
    
    return unsubscribe;
  });
  
  function dismissBanner() {
    bannerDismissed = true;
    showBanner = false;
    // Remember dismissal for this session only
    sessionStorage.setItem('emailBannerDismissed', 'true');
  }
  
  async function handleResendEmail() {
    isResending = true;
    resendMessage = '';
    
    try {
      const result = await authService.resendVerificationEmail();
      
      if (result.success) {
        resendMessage = '✓ Verification email sent!';
        setTimeout(() => {
          resendMessage = '';
        }, 3000);
      }
    } catch (error) {
      console.error('Resend error:', error);
      resendMessage = '✗ Failed to send email';
    } finally {
      isResending = false;
    }
  }
  
  function goToVerificationPage() {
    goto('/email-verification');
  }
</script>

<!-- Email Verification Banner -->
{#if showBanner}
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg rounded-lg mb-6 animate-slideDown">
    <div class="px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center flex-1 min-w-0">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {#if resendMessage}
                {resendMessage}
              {:else}
                Please verify your email address <span class="font-semibold">({user?.email})</span> to unlock all features.
              {/if}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            on:click={goToVerificationPage}
            class="px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-50 transition shadow-sm"
          >
            Verify Now
          </button>
          
          <button
            on:click={handleResendEmail}
            disabled={isResending}
            class="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? 'Sending...' : 'Resend'}
          </button>
          
          <button
            on:click={dismissBanner}
            class="text-white hover:text-orange-100 transition p-1"
            aria-label="Dismiss"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="space-y-6">
  <!-- Title -->
  <div>
    <h1 class="text-2xl font-semibold">Dashboard Overview</h1>
    <p class="text-gray-500">
      Welcome back! Here's what's happening today.
    </p>
  </div>

  <!-- Stat cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard title="Total Books" value="12,458" />
    <StatCard title="Active Users" value="3,247" />
    <StatCard title="Issued Books" value="1,892" />
    <StatCard title="Overdue Books" value="147" />
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Weekly Borrowing Trends">
      <WeeklyChart />
    </Card>

    <Card title="Monthly Circulation">
      <MonthlyChart />
    </Card>
  </div>
</div>

<style>
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }
</style>