<template>
  <div class="dark:bg-black bg-white select-none">
    <div class="">
      <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
          <div class="ml-4 mt-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">Connections</h3>
            <a class="underline cursor-pointer text-gray-400 text-xs" @click="$router.push('/')">Go Back</a>
          </div>
        </div>
      </div>
    </div>

    <div class="">
      <div v-if="credentials">
        <ul class="divide-y divide-gray-200 dark:divide-gray-800">
          <Credential v-for="credential in credentials" :key="credential.credentials_id" :credential="credential" />
        </ul>
      </div>

      <div v-else class="p-5">You have no active connections.</div>
    </div>
  </div>
</template>

<script>
import Credential from "../components/credential";

export default {
  components: {
    Credential,
  },

  computed: {
    credentials() {
      return this.$store.getters.allCredentials;
    },
  },

  mounted() {
    this.$electron.ipcRenderer.on("goto-home", (event) => {
      this.$router.push("/");
    });
  },

  destroyed() {
    this.$electron.ipcRenderer.removeAllListeners();
  },
};
</script>
