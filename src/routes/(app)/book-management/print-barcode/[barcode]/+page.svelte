<script lang="ts">
  import { page } from '$app/stores';
  import BarcodeView from '$lib/components/copies/BarcodeView.svelte';
  
  $: barcode = $page.params.barcode;
</script>

<div class="print-page">
  <BarcodeView 
    barcode={barcode}
    width={3}
    height={150}
    fontSize={28}
  />
</div>

<style>
  .print-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
  }
    
  @media print {
    .print-page {
      padding: 0;
    }
  }
</style>