<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import LoginModal from '$lib/components/Auth/LoginModal.svelte';
  import RegisterModal from '$lib/components/Auth/RegisterModal.svelte';
  import ForgotPasswordModal from '$lib/components/Auth/ForgotPasswordModal.svelte';
  import EmailConfirmationModal from '$lib/components/Auth/EmailConfirmationModal.svelte';
  
  let activeModal = 'login'; // 'login', 'register', 'forgotPassword', 'emailConfirmation'
  let emailConfirmationToken = '';
  let userEmail = '';
  let resetSuccessMessage = '';``
  
  // Check URL parameters for email confirmation
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const view = urlParams.get('view');
    
    if (token) {
      emailConfirmationToken = token;
      activeModal = 'emailConfirmation';
    } else if (view) {
      activeModal = view;
    }
  });
  
  function handleNavigation(event) {
    const destination = event.detail;
    activeModal = destination;
    resetSuccessMessage = '';
  }
  
  function handlePasswordReset(event) {
    resetSuccessMessage = event.detail.message;
    activeModal = 'login';
  }
  
  function handleCloseModal() {
    // Don't close modals on the auth page, just switch to login
    activeModal = 'login';
  }
  
  function handleEmailVerified() {
    // After email verification, show login
    activeModal = 'login';
  }
</script>

<svelte:head>
  <title>Authentication - ITC Library System</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
  <div class="w-full max-w-6xl">
    <!-- Hero Section -->
    <div class="text-center mb-8">
      <div class="inline-block p-4 bg-white/50 backdrop-blur-sm rounded-2xl mb-4">
        <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">ITC Library System</h1>
      <p class="text-lg text-gray-600">Manage your library resources efficiently</p>
    </div>
    
    <!-- Success Message for Password Reset -->
    {#if resetSuccessMessage}
      <div class="max-w-md mx-auto mb-4">
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-700 font-medium">{resetSuccessMessage}</p>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Feature Cards -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center">
        <div class="inline-block p-3 bg-blue-100 rounded-full mb-3">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Book Management</h3>
        <p class="text-sm text-gray-600">Track and manage your library inventory</p>
      </div>
      
      <div class="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center">
        <div class="inline-block p-3 bg-indigo-100 rounded-full mb-3">
          <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">User Management</h3>
        <p class="text-sm text-gray-600">Manage library members and staff</p>
      </div>
      
      <div class="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center">
        <div class="inline-block p-3 bg-purple-100 rounded-full mb-3">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Analytics</h3>
        <p class="text-sm text-gray-600">Insights and reports on library usage</p>
      </div>
    </div>
    
    <!-- Quick Action Buttons -->
    <div class="text-center">
      <div class="inline-flex gap-4 bg-white/50 backdrop-blur-sm rounded-xl p-4">
        <button
          on:click={() => activeModal = 'login'}
          class="px-6 py-2.5 {activeModal === 'login' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700'} rounded-lg font-semibold hover:shadow-lg transition"
        >
          Login
        </button>
        <button
          on:click={() => activeModal = 'register'}
          class="px-6 py-2.5 {activeModal === 'register' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700'} rounded-lg font-semibold hover:shadow-lg transition"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modals -->
<LoginModal 
  isOpen={activeModal === 'login'} 
  on:close={handleCloseModal}
  on:navigate={handleNavigation}
/>

<RegisterModal 
  isOpen={activeModal === 'register'} 
  on:close={handleCloseModal}
  on:navigate={handleNavigation}
/>

<ForgotPasswordModal 
  isOpen={activeModal === 'forgotPassword'} 
  on:close={handleCloseModal}
  on:navigate={handleNavigation}
  on:passwordReset={handlePasswordReset}
/>

<EmailConfirmationModal 
  isOpen={activeModal === 'emailConfirmation'} 
  token={emailConfirmationToken}
  {userEmail}
  on:close={handleCloseModal}
  on:navigate={handleNavigation}
  on:verified={handleEmailVerified}
/>