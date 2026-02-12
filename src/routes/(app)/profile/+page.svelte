<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import authService from '$lib/services/authService';
  import ChangePasswordModal from '$lib/components/Auth/ChangPasswordModal.svelte';
  
  // Get user data from auth store
  let user = null;
  let isLoading = true;
  let isEditing = false;
  let editForm = {};
  let isSaving = false;
  let showChangePasswordModal = false;
  let errorMessage = '';
  let successMessage = '';
  
  // Email verification states
  let isResendingEmail = false;
  let resendEmailMessage = '';
  let resendEmailError = '';
  
  // Subscribe to auth store to get real user data
  $: {
    if ($authStore.user) {
      user = {
        id: $authStore.user.id,
        name: $authStore.user.name || $authStore.user.fullName || 'User',
        email: $authStore.user.email,
        role: $authStore.user.role || 'USER',
        phoneNumber: $authStore.user.phoneNumber || 'Not provided',
        joinedDate: formatDate($authStore.user.createdAt) || 'N/A',
        isEmailConfirmed: $authStore.user.isEmailConfirmed,
        // Library statistics (you'll need to fetch these from backend)
        totalBorrowedBooks: 0,
        currentBorrowedBooks: 0,
        overdueBooks: 0
      };
      isLoading = false;
    }
  }
  
  onMount(async () => {
    // Check if user is authenticated
    if (!$authStore.isAuthenticated) {
      goto('/auth');
      return;
    }
    
    // If user data is not in store, fetch it
    if (!$authStore.user) {
      await authStore.init();
    }
  });
  
  function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  function handleEdit() {
    isEditing = true;
    editForm = { ...user };
    errorMessage = '';
    successMessage = '';
  }
  
  function handleCancel() {
    isEditing = false;
    editForm = { ...user };
    errorMessage = '';
    successMessage = '';
  }
  
  async function handleSave() {
    isSaving = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      // Make sure user.id exists!
      if (!user || !user.id) {
        errorMessage = 'User ID not found. Please login again.';
        return;
      }

      const result = await authService.updateProfile(user.id, {
        name: editForm.name,
        phoneNumber: editForm.phoneNumber,
      });
      
      if (result.success) {
        // Update the local user data
        user = { ...user, ...editForm };
        isEditing = false;
        successMessage = 'Profile updated successfully!';
        
        // Update the auth store
        if (result.user) {
          authStore.updateUser(result.user);
        }
        
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = result.error || 'Failed to update profile';
      }
    } catch (error) {
      errorMessage = 'Failed to update profile. Please try again.';
      console.error('Profile update error:', error);
    } finally {
      isSaving = false;
    }
  }
  
  function openChangePasswordModal() {
    showChangePasswordModal = true;
  }
  
  function closeChangePasswordModal() {
    showChangePasswordModal = false;
  }
  
  function navigateToDashboard() {
    goto('/');
  }
  
  function getUserInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  // Email verification functions
  async function handleResendVerificationEmail() {
    isResendingEmail = true;
    resendEmailMessage = '';
    resendEmailError = '';
    
    try {
      const result = await authService.resendVerificationEmail();
      
      if (result.success) {
        resendEmailMessage = 'Verification email sent! Please check your inbox.';
        setTimeout(() => {
          resendEmailMessage = '';
        }, 5000);
      } else {
        resendEmailError = result.error || 'Failed to send verification email.';
        setTimeout(() => {
          resendEmailError = '';
        }, 5000);
      }
    } catch (error) {
      resendEmailError = 'An error occurred. Please try again.';
      setTimeout(() => {
        resendEmailError = '';
      }, 5000);
    } finally {
      isResendingEmail = false;
    }
  }
  
  function goToVerificationPage() {
    goto('/email-verification');
  }
</script>

<svelte:head>
  <title>My Profile - ITC Library System</title>
</svelte:head>

{#if isLoading}
  <!-- Loading State -->
  <div class="max-w-4xl mx-auto flex items-center justify-center py-20">
    <div class="text-center">
      <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading profile...</p>
    </div>
  </div>
{:else if user}
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
        <p class="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>
      <button
        type="button"
        on:click={navigateToDashboard}
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
    </div>

    <!-- Success/Error Messages -->
    {#if successMessage}
      <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-green-700 font-medium">{successMessage}</p>
        </div>
      </div>
    {/if}

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

    <!-- Profile Card -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Cover Image -->
      <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      
      <!-- Profile Content -->
      <div class="px-8 pb-8">
        <!-- Avatar -->
        <div class="flex items-end -mt-16 mb-8">
          <div class="w-32 h-32 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center">
            <div class="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {getUserInitials(user.name)}
            </div>
          </div>
          <div class="ml-6 mt-15">
            <h2 class="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p class="text-gray-600">{user.email}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {user.role}
              </span>
              {#if user.isEmailConfirmed}
                <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Verified
                </span>
              {/if}
            </div>
          </div>
        </div>

        {#if !isEditing}
          <!-- View Mode -->
          <div class="space-y-6">
            <!-- Personal Information -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
                <button
                  type="button"
                  on:click={handleEdit}
                  class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p class="text-gray-900 font-medium">{user.name}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div class="flex items-center gap-2">
                    <p class="text-gray-900 font-medium">{user.email}</p>
                    {#if user.isEmailConfirmed}
                      <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    {/if}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p class="text-gray-900 font-medium">{user.phoneNumber}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p class="text-gray-900 font-medium">{user.joinedDate}</p>
                </div>
              </div>
            </div>

            <!-- Email Verification Status -->
            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Email Verification</h3>
              
              {#if user.isEmailConfirmed}
                <!-- Verified -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-green-800">Email Verified</p>
                      <p class="text-xs text-green-600 mt-0.5">Your email address has been verified</p>
                    </div>
                  </div>
                </div>
              {:else}
                <!-- Not Verified -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-yellow-800">Email Not Verified</p>
                        <p class="text-xs text-yellow-600 mt-0.5">Verify your email to access all features and secure your account</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Verification Messages -->
                  {#if resendEmailMessage}
                    <div class="bg-green-100 border border-green-300 rounded-md p-3 mb-3">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-xs text-green-700">{resendEmailMessage}</p>
                      </div>
                    </div>
                  {/if}
                  
                  {#if resendEmailError}
                    <div class="bg-red-100 border border-red-300 rounded-md p-3 mb-3">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-xs text-red-700">{resendEmailError}</p>
                      </div>
                    </div>
                  {/if}
                  
                  <div class="flex gap-2">
                    <button
                      on:click={goToVerificationPage}
                      class="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Now
                    </button>
                    <button
                      on:click={handleResendVerificationEmail}
                      disabled={isResendingEmail}
                      class="px-4 py-2 bg-white text-yellow-700 border border-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {#if isResendingEmail}
                        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      {:else}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Resend Email
                      {/if}
                    </button>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Account Security -->
            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
              <button
                type="button"
                on:click={openChangePasswordModal}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </button>
            </div>

            <!-- Library Statistics -->
            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Library Statistics</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 rounded-lg p-4">
                  <p class="text-sm text-blue-600 font-medium">Total Borrowed</p>
                  <p class="text-2xl font-bold text-blue-900 mt-1">{user.totalBorrowedBooks}</p>
                </div>
                <div class="bg-green-50 rounded-lg p-4">
                  <p class="text-sm text-green-600 font-medium">Currently Borrowed</p>
                  <p class="text-2xl font-bold text-green-900 mt-1">{user.currentBorrowedBooks}</p>
                </div>
                <div class="bg-red-50 rounded-lg p-4">
                  <p class="text-sm text-red-600 font-medium">Overdue Books</p>
                  <p class="text-2xl font-bold text-red-900 mt-1">{user.overdueBooks}</p>
                </div>
              </div>
            </div>
          </div>

        {:else}
          <!-- Edit Mode -->
          <form on:submit|preventDefault={handleSave} class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Personal Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    bind:value={editForm.name}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                    title="Email cannot be changed"
                  />
                  <p class="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>
                
                <div>
                  <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    bind:value={editForm.phoneNumber}
                    placeholder="+855123456789"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4">
              <button
                type="button"
                on:click={handleCancel}
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
                disabled={isSaving}
              >
                {#if isSaving}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                {:else}
                  Save Changes
                {/if}
              </button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <!-- Error State -->
  <div class="max-w-4xl mx-auto flex items-center justify-center py-20">
    <div class="text-center">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
      <p class="text-gray-600 mb-6">Please try logging in again</p>
      <button
        on:click={() => goto('/auth')}
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
      >
        Go to Login
      </button>
    </div>
  </div>
{/if}

<!-- Change Password Modal -->
<ChangePasswordModal 
  isOpen={showChangePasswordModal}
  on:close={closeChangePasswordModal}
/>