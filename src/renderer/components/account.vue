<template>
  <li
    class="p-5 flex hover:bg-white dark:hover:bg-gray-900 cursor-pointer"
    :class="{ 'bg-red-100 dark:bg-red-600 hover:bg-red-200 dark:hover:bg-red-500': account.error }"
    @click="account.error ? goToConnections() : copyBalance()"
  >
    <img class="h-10 w-10" :src="account.bank.icon" alt="" />
    <div class="ml-3">
      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ account.name }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-300" :class="{ 'dark:text-white': account.error }">
        {{ account.error ? account.error : account.balance }}
        <transition name="fade">
          <span v-show="balanceCopied" class="text-gray-400"> copied</span>
        </transition>
      </p>
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
      balanceCopied: false,
    };
  },

  methods: {
    goToConnections() {
      this.$router.push("/connections");
    },
    copyBalance() {
      this.$copyText(this.account.balance).then((e) => {
        this.balanceCopied = true;

        setTimeout(() => {
          this.balanceCopied = false;
        }, 2000);
      });
    },
  },
};
</script>
