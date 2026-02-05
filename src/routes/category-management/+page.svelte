<script lang="ts">
  import Card from "$lib/components/Card.svelte";

  interface Category {
    id: number;
    name: string;
    description: string;
    bookCount: number;
    color: string;
    icon: string;
  }

  let categories: Category[] = [
    {
      id: 1,
      name: "Fiction",
      description: "Novels and storytelling",
      bookCount: 45,
      color: "bg-orange-100 text-orange-800",
      icon: "📖"
    },
    {
      id: 2,
      name: "Non-Fiction",
      description: "Educational and informative books",
      bookCount: 32,
      color: "bg-blue-100 text-blue-800",
      icon: "📚"
    },
    {
      id: 3,
      name: "Philosophy",
      description: "Philosophical and thinking books",
      bookCount: 18,
      color: "bg-purple-100 text-purple-800",
      icon: "🧠"
    },
    {
      id: 4,
      name: "Technology",
      description: "Programming and tech books",
      bookCount: 27,
      color: "bg-indigo-100 text-indigo-800",
      icon: "💻"
    },
    {
      id: 5,
      name: "Science",
      description: "Science and discovery",
      bookCount: 22,
      color: "bg-green-100 text-green-800",
      icon: "🔬"
    },
    {
      id: 6,
      name: "History",
      description: "Historical events and figures",
      bookCount: 19,
      color: "bg-red-100 text-red-800",
      icon: "🏛️"
    }
  ];

  let newCategoryName = "";
  let newCategoryDescription = "";
  let newCategoryIcon = "📚";
  let showAddForm = false;
  let searchQuery = "";

  $: filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function addCategory() {
    if (!newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      name: newCategoryName,
      description: newCategoryDescription,
      bookCount: 0,
      color: "bg-gray-100 text-gray-800",
      icon: newCategoryIcon
    };

    categories = [...categories, newCategory];
    newCategoryName = "";
    newCategoryDescription = "";
    newCategoryIcon = "📚";
    showAddForm = false;
    alert("Category added successfully");
  }

  function deleteCategory(categoryId: number) {
    if (confirm("Are you sure you want to delete this category?")) {
      categories = categories.filter(c => c.id !== categoryId);
      alert("Category deleted successfully");
    }
  }

  function editCategory(category: Category) {
    const newName = prompt("Edit category name:", category.name);
    if (newName && newName.trim()) {
      category.name = newName;
      categories = categories;
      alert("Category updated successfully");
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-800">Category Management</h1>
      <p class="text-gray-600 mt-1">Manage book categories</p>
    </div>
    <button
      on:click={() => (showAddForm = !showAddForm)}
      class="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Category
    </button>
  </div>

  <!-- Add Category Form -->
  {#if showAddForm}
    <Card title="">
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-800">Add New Category</h2>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Category Icon</label>
          <input
            type="text"
            bind:value={newCategoryIcon}
            maxlength="2"
            placeholder="📚"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
          <input
            type="text"
            bind:value={newCategoryName}
            placeholder="Enter category name..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            bind:value={newCategoryDescription}
            placeholder="Enter category description..."
            rows="3"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          ></textarea>
        </div>
        <div class="flex gap-2">
          <button
            on:click={addCategory}
            class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Create Category
          </button>
          <button
            on:click={() => (showAddForm = false)}
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  {/if}

  <!-- Search Bar -->
  <div class="relative">
    <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search categories..."
      bind:value={searchQuery}
      class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  </div>

  <!-- Categories Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredCategories as category (category.id)}
      <Card title="">
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="text-4xl">{category.icon}</div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">{category.name}</h3>
                <p class="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-sm text-gray-600">Books in Category</p>
            <p class="text-2xl font-bold text-orange-500">{category.bookCount}</p>
          </div>

          <div class="flex gap-2 pt-2 border-t">
            <a
              href="/category-management/{category.id}/books"
              class="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-center text-sm"
            >
              View Books
            </a>
            <button
              on:click={() => editCategory(category)}
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
            >
              Edit
            </button>
            <button
              on:click={() => deleteCategory(category.id)}
              class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Card>
    {/each}
  </div>
</div>
