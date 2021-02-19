<template>
  <div class="dark:bg-black bg-white select-none">
    <div class="bg-white p-5 border-b border-gray-200 dark:bg-black dark:border-gray-800">
      <div class="flex items-center">
        <div class="mr-5">
          <img class="h-10 w-10" :src="account.bank.icon" alt="" />
        </div>
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ account.name }}</h3>
          <h3 class="text-sm leading-6 text-gray-900 dark:text-gray-300">{{ account.balance }}</h3>
        </div>
      </div>
    </div>

    <div class="bg-gray-100 text-sm dark:bg-gray-800 dark:text-gray-300 text-gray-500 p-3 ml-0.5 mr-0.5 cursor-pointer text-center" @click="$router.push('/')">
      <span class="underline">Back To Balances</span>
    </div>

    <div v-if="account.transactionsEnabled">
      <div v-if="transactions">
        <ul class="divide-y divide-gray-200 dark:divide-gray-800">
          <Transaction v-for="transaction in transactions" :key="transaction.transaction_id" :account="account" :transaction="transaction" />
        </ul>

        <p class="p-5 text-center text-xs text-gray-500 dark:text-gray-500">Showing the last 7 days of transactions</p>
      </div>
      <Loader v-else />
    </div>

    <div v-else class="dark:text-white p-5">We don't have the permissions required to fetch transactions for this account. Please disconnect it and connect again.</div>
  </div>
</template>

<script>
import Loader from "../components/loader.vue";
import Transaction from "../components/transaction.vue";

export default {
  components: {
    Transaction,
    Loader,
  },

  data() {
    return {
      transactions: undefined,
    };
  },

  computed: {
    account() {
      return this.$store.getters.getAccount(this.$route.params.account_id);
    },
  },

  async created() {
    this.$electron.ipcRenderer.on("goto-home", (event) => {
      this.$router.push("/");
    });

    if (this.account.transactionsEnabled) {
      this.transactions = await this.$store.getters.getTransactions(this.account);
    }
  },
};
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
