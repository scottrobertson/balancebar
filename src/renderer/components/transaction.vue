<template>
  <li class="relative py-5 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 cursor-default">
    <div class="flex justify-between space-x-3">
      <div class="min-w-0 flex-1">
        <span class="block focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true"></span>
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ transaction.description }}</p>
          <p class="text-sm text-gray-900 dark:text-white truncate">{{ formatAmount() }}</p>
        </span>
      </div>
      <div>
        <time datetime="2021-01-27T16:35" class="flex-shrink-0 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500">{{ transaction.timestamp | moment("from") }}</time>
        <p v-if="transaction.pending" class="text-xs text-gray-500 dark:text-gray-500 truncate text-right">Pending</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    transaction: {
      type: Object,
      required: true,
    },
    account: {
      type: Object,
      required: true,
    },
  },

  methods: {
    formatAmount() {
      const useAmount = this.account.type === "card" ? (this.transaction.amount !== 0 ? -this.transaction.amount : 0) : this.transaction.amount;
      return new Intl.NumberFormat("gb-EN", { style: "currency", currency: this.transaction.currency }).format(useAmount);
    },
  },
};
</script>
