<script lang="ts">
  import Card from "$lib/components/Card.svelte";

  let libraryName = "City Central Library";
  let defaultBorrowPeriod = 14;
  let maxBooksPerUser = 5;
  let reservationHoldPeriod = 3;

  let darkMode = false;
  let overdueReminders = true;
  let reservationAlerts = true;
  let newUserRegistration = true;

  let changesSaved = false;

  function saveChanges() {
    changesSaved = true;
    setTimeout(() => {
      changesSaved = false;
    }, 3000);
    console.log("Settings saved:", {
      libraryName,
      defaultBorrowPeriod,
      maxBooksPerUser,
      reservationHoldPeriod,
      darkMode,
      overdueReminders,
      reservationAlerts,
      newUserRegistration
    });
  }

  function changePassword() {
    alert("Redirect to password change page");
  }

  function enableTwoFactor() {
    alert("Enable two-factor authentication");
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Settings</h1>
    <p class="text-gray-600 mt-1">Manage your library system preferences</p>
  </div>

  <!-- Appearance Section -->
  <Card title="">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-4 border-b">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 text-lg">
            🎨
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Appearance</h2>
            <p class="text-sm text-gray-600">Customize the look and feel</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between py-3">
        <div>
          <p class="font-semibold text-gray-800">Theme Mode</p>
          <p class="text-sm text-gray-600">Switch between light and dark mode</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={darkMode} class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </Card>

  <!-- Library Settings Section -->
  <Card title="">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-4 border-b">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 text-lg">
            📚
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Library Settings</h2>
            <p class="text-sm text-gray-600">Configure library operations</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Library Name</label>
          <input
            type="text"
            bind:value={libraryName}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Default Borrow Period (days)</label>
          <input
            type="number"
            bind:value={defaultBorrowPeriod}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Maximum Books Per User</label>
          <input
            type="number"
            bind:value={maxBooksPerUser}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Reservation Hold Period (days)</label>
          <input
            type="number"
            bind:value={reservationHoldPeriod}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  </Card>

  <!-- Notifications Section -->
  <Card title="">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-4 border-b">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 text-lg">
            🔔
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Notifications</h2>
            <p class="text-sm text-gray-600">Manage notification preferences</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between py-3 border-b">
          <div>
            <p class="font-semibold text-gray-800">Overdue Reminders</p>
            <p class="text-sm text-gray-600">Send reminders for overdue books</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" bind:checked={overdueReminders} class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b">
          <div>
            <p class="font-semibold text-gray-800">Reservation Alerts</p>
            <p class="text-sm text-gray-600">Notify when reserved books are available</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" bind:checked={reservationAlerts} class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-semibold text-gray-800">New User Registration</p>
            <p class="text-sm text-gray-600">Alert when new users register</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" bind:checked={newUserRegistration} class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  </Card>

  <!-- Security Section -->
  <Card title="">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-4 border-b">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 text-lg">
            🔐
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Security</h2>
            <p class="text-sm text-gray-600">Manage account security</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="py-3 border-b">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-semibold text-gray-800">Change Password</p>
              <p class="text-sm text-gray-600">Update your account password</p>
            </div>
          </div>
          <button
            on:click={changePassword}
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
          >
            Change Password
          </button>
        </div>

        <div class="py-3">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-semibold text-gray-800">Two-Factor Authentication</p>
              <p class="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
          </div>
          <button
            on:click={enableTwoFactor}
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
          >
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  </Card>

  <!-- Save Button -->
  <div class="flex justify-end gap-3 pt-4">
    {#if changesSaved}
      <div class="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
        ✓ Changes saved successfully
      </div>
    {/if}
    <button
      on:click={saveChanges}
      class="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Save Changes
    </button>
  </div>
</div>
