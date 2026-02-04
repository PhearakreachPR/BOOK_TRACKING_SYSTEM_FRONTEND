<script>
  import { goto } from '$app/navigation';
  import ChangePassword from '$lib/components/Auth/ChangPasswordModal.svelte';
  
  function handlePasswordChanged() {
    // Redirect to profile or dashboard after successful password change
    setTimeout(() => {
      goto('/profile');
    }, 2000);
  }
  
  function handleCancel() {
    // Go back to profile
    goto('/profile');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
  <div class="max-w-4xl mx-auto">
    <ChangePassword 
      on:passwordChanged={handlePasswordChanged}
      on:cancel={handleCancel}
    />
  </div>
</div>