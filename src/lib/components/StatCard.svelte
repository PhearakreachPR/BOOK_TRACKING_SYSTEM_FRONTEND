<script>
  export let title;
  export let value;
  export let change = "";
  export let trend = "neutral";
</script>

<div class="bg-white rounded-lg p-6 shadow-sm">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-gray-600 text-sm mb-1">{title}</p>
      <p class="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div class="text-right">
      {#if change}
        <span class="text-sm font-semibold {trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}">
          {change}
        </span>
      {/if}
    </div>
  </div>
</div>
