<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let canvas: HTMLCanvasElement;


  onMount(() => {
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Borrowed",
            data: [45, 55, 40, 65, 58, 72, 48],
            backgroundColor: "#f59e0b"
          },
          {
            label: "Returned",
            data: [35, 45, 38, 50, 52, 60, 55],
            backgroundColor: "#10b981"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  });
</script>

<canvas bind:this={canvas}></canvas>
