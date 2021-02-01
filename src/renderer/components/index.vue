<template>
  <div class="flex flex-col h-screen justify-between dark:bg-black">
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
            <li class="p-5 flex hover:bg-white dark:hover:bg-gray-900" v-for="account in accounts" :key="account.id">
              <img class="h-10 w-10 dark:bg-white" :src="account.bank.logo" alt="">
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ account.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-300">{{ account.balance }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div v-else>
          Loading
        </div>
      </div>

      <div v-else class="p-5">
        No accounts here. Add one!
      </div>
    </div>

    <div class="h-10 text-center text-gray-400">
      <span class=" text-xs ">Updated: {{ lastRefeshedAt }} - </span> <a href="#" @click="refreshAccounts" class="text-center text-xs underline">Refresh</a> - <a href="#" @click="resetTrueLayer" class="text-center text-xs underline">Reset</a>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'landing-page',

    mounted () {
      if (this.hasTruelayerCredentials) {
        this.refreshAccounts()
      } else {
        this.$router.push('/truelayer')
      }
    },

    computed: {
      hasTruelayerCredentials () {
        return this.$store.getters.hasTruelayerCredentials
      },
      credentials () {
        return this.$store.getters.allCredentials
      },
      accounts () {
        return this.$store.getters.allAccounts
      },
      lastRefeshedAt () {
        if (this.$store.getters.lastRefeshedAt) {
          return this.$store.getters.lastRefeshedAt.toLocaleTimeString()
        } else {
          return 'never'
        }
      },
      redirectUrl () {
        return 'https://example.com'
      }
    },

    methods: {
      refreshAccounts () {
        this.$store.dispatch('refreshAccounts')
      },
      resetTrueLayer () {
        this.$store.dispatch('resetTrueLayerCredentials')
        this.$router.push('/truelayer')
      },
      startTrueLayerAuth () {
        this.$electron.shell.openExternal(`https://auth.truelayer.com/?response_type=code&client_id=${this.$store.getters.truelayerClientId}&scope=info%20accounts%20balance%20transactions%20cards%20direct_debits%20standing_orders%20offline_access&redirect_uri=${this.redirectUrl}&providers=uk-ob-all%20uk-oauth-all`)
      }
    }

  }
</script>
