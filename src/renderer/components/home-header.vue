<template>
  <div class="">
    <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
      <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
        <div class="ml-4 mt-2">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">Balances</h3>

          <template v-if="credentials">
            <template v-if="lastRefreshed && accounts">
              <div class="text-gray-400 text-xs flex">
                <div>Updated {{ lastRefreshed }}</div>
                <svg class="cursor-pointer w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="refreshAccounts">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </div>
            </template>

            <template v-else>
              <span class="text-gray-400 text-xs">Updating...</span>
            </template>
          </template>
        </div>
        <div class="ml-4 mt-2 flex-shrink-0 pt-2">
          <button
            type="button"
            class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black dark:bg-gray-700 hover:bg-gray-800 focus:outline-none"
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
      const providers = [
        "uk-ob-all",
        "uk-oauth-all",
        "uk-cs-mock",
        "fr-ob-all",
        "fr-stet-all",
        "de-ob-all",
        "de-xs2a-all",
        "ie-ob-all",
        "it-ob-all",
        "it-xs2a-all",
        "lt-xs2a-all",
        "pl-polishapi-all",
        "es-ob-all",
        "es-xs2a-all",
      ].join("%20");

      const scopes = ["info", "accounts", "balance", "cards", "offline_access", "transactions"].join("%20");

      this.$electron.shell.openExternal(
        `https://auth.truelayer.com/?response_type=code&client_id=${this.$store.getters.truelayerClientId}&scope=${scopes}&redirect_uri=balancebar://oauth&providers=${providers}`
      );
    },

    refreshAccounts() {
      this.$store.dispatch("refreshAccounts");
    },
  },
};
</script>
