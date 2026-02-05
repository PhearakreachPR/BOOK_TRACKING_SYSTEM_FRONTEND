<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let canvas: HTMLCanvasElement;


  onMount(() => {
    new Chart(canvas, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Books Borrowed",
            data: [420, 380, 520, 480, 600, 650],
            borderColor: "#f59e0b",
            backgroundColor: "#fef3c7",
            tension: 0.4,
            fill: true
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
