<template>
  <div class="dark:bg-black bg-white select-none">
    <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800">
      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Setup TrueLayer</h3>
    </div>

    <div class="pl-5 pr-5 bg-white dark:bg-black dark:text-white mt-5">
      <p class="">To use Balance Bar, you must first connect to TrueLayer, an FCA authorised company, providing access to banking data.</p>

      <p class="mt-5">Head over to TrueLayer and follow the signup process.</p>

      <p class="mt-5">
        <a class="cursor-pointer underline" @click="openLink('https://console.truelayer.com')">https://console.truelayer.com</a>
      </p>

      <p class="mt-5">Once you have setup your TrueLayer account, change to the Live environment by clicking the button at the top right of the TrueLayer Console.</p>

      <p class="mt-5">Next, head to the <a class="cursor-pointer underline" @click="openLink('https://console.truelayer.com/settings/')">Data Settings</a> page, and add the following Redirect URI:</p>

      <p class="mt-5">
        <span class="border-b-2 border-dotted select-all" @click.stop="copyCallbackUrl()">{{ callbackUrl }}</span>
        <span v-if="callbackUrlCopied"> - copied</span>
      </p>

      <p class="mt-5">Click the reset button under "client_secret". This will download your Live Client Secret.</p>

      <p class="mt-5">Once you have done that, copy the Client ID, and add it and your Client Secret to the form below.</p>

      <form @submit="saveCredentials">
        <div class="mt-5">
          <label for="client_id" class="block text-sm font-medium text-gray-700 dark:text-white">TrueLayer Client ID</label>
          <div class="mt-1">
            <input
              id="client_id"
              v-model="clientId"
              type="text"
              name="client_id"
              class="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md dark:text-black"
              placeholder="TrueLayer Client ID"
            />
          </div>
        </div>

        <div class="mt-5">
          <label for="client_secret" class="block text-sm font-medium text-gray-700 dark:text-white">TrueLayer Client Secret</label>
          <div class="mt-1">
            <input
              id="client_secret"
              v-model="clientSecret"
              type="password"
              name="client_secret"
              class="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md dark:text-black"
              placeholder="TrueLayer Client Secret"
            />
          </div>
        </div>

        <div class="mt-5">
          <button
            type="button"
            class="w-full text-center px-2 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black dark:bg-gray-700 hover:bg-gray-800 focus:outline-none"
            @click="saveCredentials"
          >
            Save Credentials
          </button>
        </div>
      </form>
    </div>

    <div class="text-xs text-center text-gray-400 dark:text-gray-400 p-5">Your secret will be encrypted in your system's keychain.</div>
  </div>
</template>

<script>
import { getTruelayerSecret } from "../services/secure-storage";

export default {
  data() {
    return {
      callbackUrl: "balancebar://oauth",
      clientId: undefined,
      clientSecret: undefined,
      callbackUrlCopied: false,
    };
  },

  computed: {
    hasTruelayerClient() {
      return this.$store.getters.hasTruelayerClient;
    },
  },

  async created() {
    this.$electron.ipcRenderer.on("goto-home", (event) => {
      this.$router.push("/");
    });

    if (this.hasTruelayerClient) {
      this.clientId = this.$store.getters.truelayerClientId;
      this.clientSecret = await getTruelayerSecret();
    }
  },

  destroyed() {
    this.$electron.ipcRenderer.removeAllListeners();
  },

  methods: {
    copyCallbackUrl() {
      this.$copyText(this.callbackUrl).then((e) => {
        this.callbackUrlCopied = true;

        setTimeout(() => {
          this.callbackUrlCopied = false;
        }, 2000);
      });
    },

    openLink(link) {
      this.$electron.shell.openExternal(link);
    },
    saveCredentials() {
      this.$store.dispatch("setTrueLayer", {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      });

      this.$store.dispatch("refreshAccounts");
      this.$router.push("/");
    },
  },
};
</script>
