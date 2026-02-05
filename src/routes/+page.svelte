<script>
  import StatCard from "$lib/components/StatCard.svelte";
  import WeeklyChart from "$lib/components/WeeklyChart.svelte";
  import MonthlyChart from "$lib/components/MonthlyChart.svelte";
  import Card from "$lib/components/Card.svelte";
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      <p class="text-gray-600 mt-1">Welcome back! Here's what's happening with your library today.</p>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-4 gap-4">
    <StatCard title="Total Books" value="12,458" change="+12%" trend="up" />
    <StatCard title="Active Users" value="3,247" change="+8%" trend="up" />
    <StatCard title="Issued Books" value="1,892" change="" trend="neutral" />
    <StatCard title="Overdue Books" value="147" change="-3%" trend="down" />
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-2 gap-6">
    <Card title="Weekly Borrowing Trends">
      <WeeklyChart />
    </Card>
    <Card title="Monthly Circulation">
      <MonthlyChart />
    </Card>
  </div>

  <!-- Recent Activities and Popular Books -->
  <div class="grid grid-cols-2 gap-6">
    <Card title="Recent Activities">
      <div class="space-y-4">
        <div class="flex items-start gap-3 pb-3 border-b">
          <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
          <div>
            <p class="font-medium text-gray-800">Book borrowed</p>
            <p class="text-sm text-gray-600">Sarah Johnson • The Great Gatsby</p>
            <p class="text-xs text-gray-500 mt-1">5 min ago</p>
          </div>
        </div>
        <div class="flex items-start gap-3 pb-3 border-b">
          <div class="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
          <div>
            <p class="font-medium text-gray-800">Book returned</p>
            <p class="text-sm text-gray-600">Michael Chen • 1984</p>
            <p class="text-xs text-gray-500 mt-1">12 min ago</p>
          </div>
        </div>
        <div class="flex items-start gap-3 pb-3 border-b">
          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <p class="font-medium text-gray-800">New user registered</p>
            <p class="text-sm text-gray-600">Emily Davis</p>
            <p class="text-xs text-gray-500 mt-1">23 min ago</p>
          </div>
        </div>
        <div class="flex items-start gap-3 pb-3 border-b">
          <div class="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
          <div>
            <p class="font-medium text-gray-800">Book reserved</p>
            <p class="text-sm text-gray-600">James Wilson • To Kill a Mockingbird</p>
            <p class="text-xs text-gray-500 mt-1">1 hour ago</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
          <div>
            <p class="font-medium text-gray-800">Fine paid</p>
            <p class="text-sm text-gray-600">Anna Martinez • Pride and Prejudice</p>
            <p class="text-xs text-gray-500 mt-1"></p>
          </div>
        </div>
      </div>
    </Card>

    <Card title="Popular Books">
      <div class="space-y-4">
        <div class="flex justify-between items-start pb-3 border-b">
          <div>
            <p class="font-medium text-gray-800">The Great Gatsby</p>
            <p class="text-sm text-gray-600">F. Scott Fitzgerald</p>
          </div>
          <span class="text-orange-500 font-semibold">45 borrowed</span>
        </div>
        <div class="flex justify-between items-start pb-3 border-b">
          <div>
            <p class="font-medium text-gray-800">To Kill a Mockingbird</p>
            <p class="text-sm text-gray-600">Harper Lee</p>
          </div>
          <span class="text-orange-500 font-semibold">38 borrowed</span>
        </div>
        <div class="flex justify-between items-start pb-3 border-b">
          <div>
            <p class="font-medium text-gray-800">1984</p>
            <p class="text-sm text-gray-600">George Orwell</p>
          </div>
          <span class="text-orange-500 font-semibold">36 borrowed</span>
        </div>
        <div class="flex justify-between items-start pb-3 border-b">
          <div>
            <p class="font-medium text-gray-800">Pride and Prejudice</p>
            <p class="text-sm text-gray-600">Jane Austen</p>
          </div>
          <span class="text-orange-500 font-semibold">32 borrowed</span>
        </div>
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium text-gray-800">The Catcher in the Rye</p>
            <p class="text-sm text-gray-600">J.D. Salinger</p>
          </div>
          <span class="text-orange-500 font-semibold">28 borrowed</span>
        </div>
      </div>
    </Card>
  </div>
</div>
