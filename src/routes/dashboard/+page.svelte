<script>
  import Card from "$lib/components/Card.svelte";
  import StatCard from "$lib/components/StatCard.svelte";
  import WeeklyChart from "$lib/components/WeeklyChart.svelte";
  import MonthlyChart from "$lib/components/MonthlyChart.svelte";
</script>

<div class="space-y-6">
  <!-- Title -->
  <div>
    <h1 class="text-2xl font-semibold">Dashboard Overview</h1>
    <p class="text-gray-500">
      Welcome back! Here's what's happening today.
    </p>
  </div>

  <!-- Stat cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard title="Total Books" value="12,458" />
    <StatCard title="Active Users" value="3,247" />
    <StatCard title="Issued Books" value="1,892" />
    <StatCard title="Overdue Books" value="147" />
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Weekly Borrowing Trends">
      <WeeklyChart />
    </Card>

    <Card title="Monthly Circulation">
      <MonthlyChart />
    </Card>
  </div>
</div>
