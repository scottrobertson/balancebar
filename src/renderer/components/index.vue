<template>
  <div class="flex flex-col h-screen justify-between dark:bg-black pl-0.5 pr-0.5">
    <div class="h-10">
      <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
          <div class="ml-4 mt-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">
              Balances
            </h3>
          </div>
          <div class="ml-4 mt-2 flex-shrink-0 pt-2">
            <button @click="startTrueLayerAuth" type="button" class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="h-10 mb-auto mt-8">
      <div v-if="credentials">
        <div v-if="accounts">
          <ul class="divide-y divide-gray-200 dark:divide-gray-800">
            <li class="p-5 flex hover:bg-white dark:hover:bg-gray-900" :class="{ 'bg-red-100 dark:bg-red-600 hover:bg-red-200 dark:hover:bg-red-500': account.hasError }" v-for="account in accounts" :key="account.id">
              <img class="h-10 w-10 dark:bg-white" :src="account.bank.logo" alt="">
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ account.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-300" :class="{ 'dark:text-white': account.hasError }">{{ account.balance }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div v-else class="p-5">
          No accounts found for the credentials given. This generally means access has been denied.

          <div class="mt-5">
            <div v-for="credential in credentials" :key="credential.credentials_id"> - {{ credential.provider.display_name }}</div>
          </div>
        </div>
      </div>

      <div v-else class="p-5 dark:text-white">
        No credentials here. Add one!
      </div>
    </div>

    <div v-if="lastRefreshed" class="h-10 text-center text-gray-400">
      <span class=" text-xs ">Updated: {{ lastRefreshed }} - </span> <a href="#" @click="refreshAccounts" class="text-center text-xs underline">Refresh</a>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'landing-page',

    data () {
      return {
        lastRefreshed: undefined
      }
    },

    mounted () {
      if (this.hasTruelayerClient) {
        this.refreshAccounts()

        // Refresh accounts every hour
        setInterval(() => { this.refreshAccounts() }, 60000 * 60)

        // Keep the "last updated at" reactive.
        setInterval(() => { this.updateLocalRefreshedAt(this.lastRefreshedAt) }, 30000)

        this.$electron.ipcRenderer.on('refresh', () => {
          this.refreshAccounts()
        })

        this.$electron.ipcRenderer.on('reset', () => {
          this.resetAll()
        })

        this.$electron.ipcRenderer.on('load-examples', () => {
          this.loadExampleCredentials()
        })
      } else {
        this.$router.push('/truelayer')
      }
    },

    computed: {
      hasTruelayerClient () {
        return this.$store.getters.hasTruelayerClient
      },
      credentials () {
        return this.$store.getters.allCredentials
      },
      accounts () {
        return this.$store.getters.allAccounts
      },
      lastRefreshedAt () {
        return this.$store.getters.lastRefreshedAt
      },
      redirectUrl () {
        return 'https://example.com'
      }
    },

    watch: {
      lastRefreshedAt (newValue, oldValue) {
        this.updateLocalRefreshedAt(newValue)
      }
    },

    methods: {
      updateLocalRefreshedAt (value) {
        this.lastRefreshed = this.$moment(value).fromNow()
      },
      refreshAccounts () {
        this.$store.dispatch('refreshAccounts')
      },
      resetAll () {
        this.$store.dispatch('resetAll')
        this.$router.push('/truelayer')
      },
      loadExampleCredentials () {
        this.$store.dispatch('loadExampleCredentials')
      },
      startTrueLayerAuth () {
        const oAuthUrl = `https://auth.truelayer.com/?response_type=code&client_id=${this.$store.getters.truelayerClientId}&scope=accounts%20balance%20cards%20offline_access&redirect_uri=${this.redirectUrl}&providers=uk-ob-all%20uk-oauth-all`
        this.$electron.ipcRenderer.sendSync('oauth-start', oAuthUrl)
      }
    }

  }
</script>
