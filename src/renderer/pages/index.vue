<template>
  <div class="dark:bg-black bg-white select-none">
    <div v-if="isConnecting">
      <div class="spinner">
        <div class="double-bounce1" />
        <div class="double-bounce2" />
      </div>
    </div>

    <div v-else>
      <Header />

      <div v-if="credentials">
        <div v-if="accounts && accounts.length > 0">
          <ul class="divide-y divide-gray-200 dark:divide-gray-800">
            <Account v-for="account in accounts" :key="account.id" :account="account" />
          </ul>
        </div>

        <div v-else-if="accounts && accounts.length == 0" class="p-5">
          No accounts found for the credentials given. This generally means access has been denied.

          <div class="mt-5">
            <div v-for="credential in credentials" :key="credential.credentials_id">- {{ credential.provider.display_name }}</div>
          </div>
        </div>

        <Loader v-else-if="accounts === undefined" />
      </div>

      <div v-else class="p-5 dark:text-white text-center">You have not added any bank accounts yet. Get started by clicking the button above.</div>
    </div>
  </div>
</template>

<script>
import { credentialsFromUrl } from "../services/truelayer-oauth";

import Loader from "../components/loader";
import Account from "../components/account";
import Header from "../components/home-header";

export default {
  name: "LandingPage",

  components: {
    Account,
    Header,
    Loader,
  },

  computed: {
    hasTruelayerClient() {
      return this.$store.getters.hasTruelayerClient;
    },
    credentials() {
      return this.$store.getters.allCredentials;
    },
    accounts() {
      return this.$store.getters.allAccounts;
    },
    isConnecting() {
      return this.$store.getters.isConnecting;
    },
  },

  watch: {
    lastRefreshedAt(newValue, _oldValue) {
      this.updateLocalRefreshedAt(newValue);
    },
  },

  async mounted() {
    await this.$store.dispatch("setConnecting", false);

    // Electron messages from menubar app
    this.$electron.ipcRenderer.on("refresh", () => {
      this.refreshAccounts();
    });

    this.$electron.ipcRenderer.on("reset", () => {
      this.resetAll();
    });

    this.$electron.ipcRenderer.on("handle-oauth", (event, url) => {
      this.addCredentialsFromUrl(url);
    });

    this.$electron.ipcRenderer.on("goto-connections", (event) => {
      this.$router.push("/connections");
    });

    this.$electron.ipcRenderer.on("goto-truelayer", (event) => {
      this.$router.push("/truelayer");
    });

    // Redirect if we don't have TrueLayer connected
    if (this.hasTruelayerClient) {
      if (!this.accounts) {
        await this.$store.dispatch("refreshAccounts");
      }

      // Update every hour
      setInterval(() => this.$store.dispatch("refreshAccounts"), 3600000);
    } else {
      this.$router.push("/truelayer");
    }
  },

  destroyed() {
    this.$electron.ipcRenderer.removeAllListeners();
  },

  methods: {
    async addCredentialsFromUrl(url) {
      console.log("oAuth callback url received:", url);

      this.$store.dispatch("resetAccounts");

      const credentials = await credentialsFromUrl(this.$store.getters.truelayerClientId, url);

      if (credentials) {
        await this.$store.dispatch("addCredential", credentials);
      } else {
        // TODO show error
        await this.refreshAccounts();
      }

      await this.$store.dispatch("setConnecting", false);
    },
    refreshAccounts() {
      this.$store.dispatch("refreshAccounts");
    },
    resetAll() {
      this.$store.dispatch("resetAll");
      this.$router.push("/truelayer");
    },
  },
};
</script>
