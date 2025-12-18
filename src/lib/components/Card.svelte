<script>
  export let title;
</script>

<div class="bg-white rounded-lg p-6 shadow-sm">
  {#if title}
    <h3 class="font-semibold text-lg mb-4 text-gray-800">{title}</h3>
  {/if}
  <slot />
</div>

