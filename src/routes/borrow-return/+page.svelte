<script lang="ts">
  import Card from "$lib/components/Card.svelte";

  interface Transaction {
    id: string;
    user: string;
    userCode: string;
    book: string;
    isbn: string;
    borrowDate: string;
    dueDate: string;
    renewals: number;
    status: "Borrowed" | "Overdue" | "Renewed";
  }

  let activeTransactions: Transaction[] = [
    {
      id: "#00011",
      user: "Sarah Johnson",
      userCode: "UG01",
      book: "The Great Gatsby",
      isbn: "978-0-7432-7356-5",
      borrowDate: "2024-12-01",
      dueDate: "2024-12-15",
      renewals: 0,
      status: "Borrowed"
    },
    {
      id: "#00012",
      user: "Michael Chen",
      userCode: "UG02",
      book: "To Kill a Mockingbird",
      isbn: "978-0-06-112008-4",
      borrowDate: "2024-12-03",
      dueDate: "2024-12-17",
      renewals: 1,
      status: "Borrowed"
    },
    {
      id: "#00013",
      user: "James Wilson",
      userCode: "UG03",
      book: "1984",
      isbn: "978-0-452-28423-4",
      borrowDate: "2024-11-20",
      dueDate: "2024-12-04",
      renewals: 2,
      status: "Overdue"
    },
    {
      id: "#00014",
      user: "Emily Davis",
      userCode: "UG03",
      book: "Sapiens",
      isbn: "978-0-06-231609-7",
      borrowDate: "2024-12-05",
      dueDate: "2024-12-19",
      renewals: 0,
      status: "Borrowed"
    },
    {
      id: "#00015",
      user: "Anna Martinez",
      userCode: "UG05",
      book: "Clean Code",
      isbn: "978-0-13-235088-4",
      borrowDate: "2024-11-28",
      dueDate: "2024-12-12",
      renewals: 1,
      status: "Borrowed"
    }
  ];

  let issuedUser = "";
  let issuedBook = "";
  let issueDate = new Date().toISOString().split('T')[0];

  let returnTransactionId = "";
  let returnBookSearch = "";
  let bookCondition = "Good";

  function getStatusColor(status: string) {
    if (status === "Borrowed") return "bg-blue-100 text-blue-700";
    if (status === "Overdue") return "bg-red-100 text-red-700";
    if (status === "Renewed") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  }

  function issueBook() {
    if (!issuedUser || !issuedBook) {
      alert("Please fill in all fields");
      return;
    }
    alert(`Book issued to ${issuedUser}`);
    issuedUser = "";
    issuedBook = "";
  }

  function processReturn() {
    if (!returnTransactionId || !returnBookSearch) {
      alert("Please fill in all fields");
      return;
    }
    alert(`Book returned - Transaction ${returnTransactionId}`);
    returnTransactionId = "";
    returnBookSearch = "";
  }

  function renewBook(transactionId: string) {
    alert(`Book renewed for transaction ${transactionId}`);
  }

  function handleReturnBook(transactionId: string) {
    alert(`Processing return for transaction ${transactionId}`);
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-gray-800">Borrow & Return</h1>
    <p class="text-gray-600 mt-1">Manage book transactions and returns</p>
  </div>

  <!-- Two Column Layout -->
  <div class="grid grid-cols-2 gap-6">
    <!-- Issue Book Panel -->
    <Card title="">
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-4 border-b">
          <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 text-lg font-bold">
            📤
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Issue Book</h2>
            <p class="text-sm text-gray-600">Process a new book borrowing</p>
          </div>
        </div>

        <!-- Issue Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">User ID or Name</label>
            <input
              type="text"
              placeholder="Search user..."
              bind:value={issuedUser}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Book ISBN or Title</label>
            <input
              type="text"
              placeholder="Search book..."
              bind:value={issuedBook}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              bind:value={issueDate}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <button
            on:click={issueBook}
            class="w-full px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            Issue Book
          </button>
        </div>
      </div>
    </Card>

    <!-- Return Book Panel -->
    <Card title="">
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-4 border-b">
          <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg font-bold">
            📥
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Return Book</h2>
            <p class="text-sm text-gray-600">Process a book return</p>
          </div>
        </div>

        <!-- Return Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              placeholder="Enter transaction ID..."
              bind:value={returnTransactionId}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Or Search by User</label>
            <input
              type="text"
              placeholder="Search user..."
              bind:value={returnBookSearch}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Book Condition</label>
            <select
              bind:value={bookCondition}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option>Good</option>
              <option>Damaged</option>
              <option>Missing Pages</option>
              <option>Lost</option>
            </select>
          </div>

          <button
            on:click={processReturn}
            class="w-full px-4 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Process Return
          </button>
        </div>
      </div>
    </Card>
  </div>

  <!-- Active Transactions Table -->
  <Card title="">
    <div>
      <h2 class="text-lg font-bold text-gray-900 mb-4">Active Transactions</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr class="text-left font-semibold text-gray-700">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">Book</th>
              <th class="px-4 py-3">Borrow Date</th>
              <th class="px-4 py-3">Due Date</th>
              <th class="px-4 py-3">Renewals</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each activeTransactions as transaction (transaction.id)}
              <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 font-semibold text-gray-900">{transaction.id}</td>
                <td class="px-4 py-3">
                  <div>
                    <p class="font-medium text-gray-900">{transaction.user}</p>
                    <p class="text-xs text-gray-500">{transaction.userCode}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <p class="font-medium text-gray-900">{transaction.book}</p>
                    <p class="text-xs text-gray-500">{transaction.isbn}</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-700">{transaction.borrowDate}</td>
                <td class="px-4 py-3">
                  <div>
                    <p class="text-gray-700">{transaction.dueDate}</p>
                    <p class="text-xs text-red-600 font-semibold">Fine: $1.00</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-center">
                    <p class="text-gray-700 font-medium">{transaction.renewals}/2</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold {getStatusColor(transaction.status)}">
                    {transaction.status}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      on:click={() => renewBook(transaction.id)}
                      class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                    >
                      Renew
                    </button>
                    <button
                      on:click={() => handleReturnBook(transaction.id)}
                      class="px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs font-medium"
                    >
                      Return
                    </button>
                    <button class="px-3 py-1.5 text-gray-500 hover:text-gray-700 transition text-xs" aria-label="More options">
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Borrowing Policy Info -->
      <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-900">
          <strong>📋 Borrowing Policy:</strong> Each user can borrow up to 5 books at a time. Books can be renewed up to 2 times if not reserved. Standard borrowing period is 14 days.
        </p>
      </div>
    </div>
  </Card>
</div>
