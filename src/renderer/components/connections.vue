<template>
  <div class="dark:bg-black">
    <div class="">
      <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
          <div class="ml-4 mt-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">
              Connections
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div class="">
      <div v-if="credentials">
        <ul class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="credential in credentials"
            :key="credential.credentials_id"
            class="p-5 flex hover:bg-white dark:hover:bg-gray-900"
          >
            <img
              class="h-10 w-10"
              :src="credential.provider.logo_uri"
              alt=""
            >
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ credential.provider.display_name }}
              </p>
              <p
                v-if="credential.consent_created_at"
                class="text-xs dark:text-white"
              >
                Connected {{ credential.consent_created_at | moment('from') }}
              </p>
              <a
                class="underline cursor-pointer text-xs text-gray-500 dark:text-gray-300"
                @click="disconnectCredential(credential)"
              >
                Disconnect
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  computed: {
    credentials () {
      return this.$store.getters.allCredentials
    }
  },

  mounted () {
    this.$electron.ipcRenderer.on('goto-home', (event) => {
      this.$router.push('/')
    })
  },

  methods: {
    async disconnectCredential (credential) {
      await this.$store.dispatch('deleteCredential', credential)
    }
  }
}
</script>
