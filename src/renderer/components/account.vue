<template>
  <li
    class="p-5 flex items-center hover:bg-white dark:hover:bg-gray-900"
    :class="{ 'bg-red-100 dark:bg-red-600 hover:bg-red-200 dark:hover:bg-red-500': account.error }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="flex-1 flex items-center">
      <img class="flex-shrink-0 h-10 w-10" :src="account.bank.icon" alt="" />
      <div class="flex-1 ml-3">
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ screenshotMode ? "Account Name" : account.name }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-300" :class="{ 'dark:text-white': account.error }">
          <span v-if="screenshotMode">£123.45</span>
          <span v-else-if="account.error">{{ account.error }}</span>
          <span v-else class="flex" @click.stop="copyBalance()">
            <span class="cursor-pointer">{{ account.balance }}</span>

            <svg v-show="hovered" class="cursor-pointer ml-1 mt-0.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              ></path>
            </svg>

            <transition name="fade">
              <span v-show="balanceCopied" class="text-gray-400 ml-1"> copied</span>
            </transition>
          </span>
        </p>
      </div>
    </div>

    <div v-show="!account.error" class="">
      <svg
        class="cursor-pointer w-4 h-4 text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        @click="goToTransactions()"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      hovered: false,
      balanceCopied: false,
      screenshotMode: false, // A development helper to hide details for screenshots
    };
  },

  methods: {
    copyBalance() {
      this.$copyText(this.account.balance).then((e) => {
        this.balanceCopied = true;

        setTimeout(() => {
          this.balanceCopied = false;
        }, 2000);
      });
    },

    goToTransactions() {
      this.$router.push(`/transactions/${this.account.id}`);
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
