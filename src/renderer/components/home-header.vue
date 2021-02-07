<template>
  <div class="">
    <div v-show="!oAuthConnecting" class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
      <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
        <div class="ml-4 mt-2">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">Balances</h3>

          <div v-if="credentials">
            <div v-if="lastRefreshed && accounts">
              <span class="text-gray-400 text-xs">Last updated {{ lastRefreshed }} - <a class="underline cursor-pointer" @click="refreshAccounts">Refresh</a></span>
            </div>

            <div v-else>
              <span class="text-gray-400 text-xs">Updating...</span>
            </div>
          </div>
        </div>
        <div class="ml-4 mt-2 flex-shrink-0 pt-2">
          <button
            type="button"
            class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="startTrueLayerAuth"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastRefreshed: undefined,
      oAuthConnecting: false,
    };
  },

  computed: {
    lastRefreshedAt() {
      return this.$store.getters.lastRefreshedAt;
    },
    accounts() {
      return this.$store.getters.allAccounts;
    },
    credentials() {
      return this.$store.getters.allCredentials;
    },
  },

  mounted() {
    // Keep the "last updated at" reactive.
    this.updateLocalRefreshedAt(this.lastRefreshedAt);
    setInterval(() => {
      this.updateLocalRefreshedAt(this.lastRefreshedAt);
    }, 5000);
  },

  methods: {
    updateLocalRefreshedAt(value) {
      this.lastRefreshed = this.$moment(value).fromNow();
    },

    async startTrueLayerAuth() {
      this.oAuthConnecting = true;
      await this.$store.dispatch("resetAccounts");
      await new Promise((r) => setTimeout(r, 500));

      this.$electron.ipcRenderer.sendSync("oauth-start", this.$store.getters.truelayerClientId);
    },

    refreshAccounts() {
      this.$store.dispatch("refreshAccounts");
    },
  },
};
</script>
