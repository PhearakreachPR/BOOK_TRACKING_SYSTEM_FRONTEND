<script lang="ts">
  export let title = '';
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  {#if title}
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  {/if}
  <div class="p-6">
    <slot />
  </div>
</div>