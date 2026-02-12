<script lang="ts">
  import { onMount } from 'svelte';

  export let barcode: string;
  export let displayValue = true;
  export let width = 2;
  export let height = 100;
  export let fontSize = 20;
  export let format: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14' = 'CODE128';
  export let lineColor = '#000000';
  export let background = '#ffffff';

  let canvas: HTMLCanvasElement;
  let svg: SVGElement;
  let error = '';
  let useCanvas = true; // Can switch between canvas and SVG

  onMount(() => {
    generateBarcode();
  });

  $: if ((canvas || svg) && barcode) {
    generateBarcode();
  }

  async function generateBarcode() {
    try {
      error = '';
      
      // Dynamically import JsBarcode
      const JsBarcode = (await import('jsbarcode')).default;

      if (useCanvas && canvas) {
        JsBarcode(canvas, barcode, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          lineColor: lineColor,
          background: background,
          margin: 10,
          marginTop: 10,
          marginBottom: displayValue ? 5 : 10,
        });
      } else if (!useCanvas && svg) {
        JsBarcode(svg, barcode, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          lineColor: lineColor,
          background: background,
          margin: 10,
          marginTop: 10,
          marginBottom: displayValue ? 5 : 10,
        });
      }
    } catch (err: any) {
      error = err.message || 'Failed to generate barcode';
      console.error('Barcode generation error:', err);
    }
  }

  function downloadBarcode() {
    if (canvas) {
      const link = document.createElement('a');
      link.download = `barcode-${barcode}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  function printBarcode() {
    if (canvas) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Barcode - ${barcode}</title>
              <style>
                body { 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0;
                }
                img { 
                  max-width: 100%; 
                  height: auto; 
                }
              </style>
            </head>
            <body>
              <img src="${canvas.toDataURL()}" alt="Barcode ${barcode}" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  }
</script>

<div class="barcode-container">
  {#if error}
    <div class="error-message">
      <p class="text-red-600 text-sm font-medium">{error}</p>
      <p class="text-gray-500 text-xs mt-1">Unable to generate barcode for: {barcode}</p>
    </div>
  {:else}
    <div class="barcode-wrapper">
      {#if useCanvas}
        <canvas bind:this={canvas} class="barcode-canvas"></canvas>
      {:else}
        <svg bind:this={svg} class="barcode-svg"></svg>
      {/if}
    </div>

    <!-- Action Buttons -->
    <div class="barcode-actions">
      <button
        on:click={downloadBarcode}
        class="action-btn"
        title="Download barcode"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>
      <button
        on:click={printBarcode}
        class="action-btn"
        title="Print barcode"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
    </div>
  {/if}
</div>

<style>
  .barcode-container {
    display: inline-block;
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .barcode-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }

  .barcode-canvas,
  .barcode-svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .barcode-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: center;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .action-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .action-btn:active {
    transform: scale(0.98);
  }

  .error-message {
    padding: 1rem;
    text-align: center;
  }
</style>