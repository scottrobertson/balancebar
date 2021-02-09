<template>
  <div class="dark:bg-black bg-white">
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

        <div v-else-if="accounts === undefined" class="p-5 dark:text-gray-400 text-center">
          <div class="spinner">
            <div class="double-bounce1" />
            <div class="double-bounce2" />
          </div>
        </div>
      </div>

      <div v-else class="p-5 dark:text-white">No credentials here. Add one!</div>
    </div>
  </div>
</template>

<script>
import { credentialsFromUrl } from "../services/truelayer-oauth";

import Account from "../components/account";
import Header from "../components/home-header";

export default {
  name: "LandingPage",

  components: {
    Account,
    Header,
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

    // Redirect if we don't have TrueLayer connected
    if (this.hasTruelayerClient) {
      this.refreshAccounts();
    } else {
      this.$router.push("/truelayer");
    }
  },

  methods: {
    async addCredentialsFromUrl(url) {
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

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
