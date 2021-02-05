<template>
  <div class="dark:bg-black">
    <div class="">
      <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
          <div class="ml-4 mt-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">
              Balances
            </h3>

            <div v-if="lastRefreshed" class="text-gray-400">
              <span class=" text-xs ">Last updated {{ lastRefreshed }}</span>
            </div>
          </div>
          <div class="ml-4 mt-2 flex-shrink-0 pt-2">
            <button @click="startTrueLayerAuth" type="button" class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="">
      <div v-if="credentials">
        <div v-if="accounts && accounts.length > 0">
          <ul class="divide-y divide-gray-200 dark:divide-gray-800">
            <li @click="copyBalance(account)" class="p-5 flex hover:bg-white dark:hover:bg-gray-900 cursor-pointer" :class="{ 'bg-red-100 dark:bg-red-600 hover:bg-red-200 dark:hover:bg-red-500': account.hasError }" v-for="account in accounts" :key="account.id">
              <img class="h-10 w-10" :src="account.bank.icon" alt="">
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ account.bank.name }} - {{ account.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-300" :class="{ 'dark:text-white': account.hasError }">
                  {{ account.balance }}<transition name="fade"><span class="text-gray-400" v-show="copiedBalanceAccount === account"> copied</span></transition>
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div v-else-if="accounts && accounts.length == 0" class="p-5">
          No accounts found for the credentials given. This generally means access has been denied.

          <div class="mt-5">
            <div v-for="credential in credentials" :key="credential.credentials_id"> - {{ credential.provider.display_name }}</div>
          </div>
        </div>

        <div v-else-if="accounts === undefined" class="p-5">
          Refreshing accounts, please wait...
        </div>
      </div>

      <div v-else class="p-5 dark:text-white">
        No credentials here. Add one!
      </div>
    </div>
  </div>


</template>

<script>
  const {AuthAPIClient, DataAPIClient} = require('truelayer-client')

export default {
    name: 'landing-page',

    data () {
      return {
        lastRefreshed: undefined,
        copiedBalanceAccount: undefined
      }
    },

    mounted () {
      if (this.hasTruelayerClient) {
        if (this.accounts === undefined) {
          this.refreshAccounts()
        }

        // Refresh accounts every hour
        setInterval(() => { this.refreshAccounts() }, 60000 * 60)

        // Keep the "last updated at" reactive.
        setInterval(() => { this.updateLocalRefreshedAt(this.lastRefreshedAt) }, 5000)

        this.$electron.ipcRenderer.on('refresh', () => {
          this.refreshAccounts()
        })

        this.$electron.ipcRenderer.on('reset', () => {
          this.resetAll()
        })

        this.$electron.ipcRenderer.on('handle-oauth', (event, url) => {
          this.addCredentialsFromUrl(url)
        })

        this.$electron.ipcRenderer.on('goto-connections', (event) => {
          this.$router.push('/connections')
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
        return 'http://localhost'
      }
    },

    watch: {
      lastRefreshedAt (newValue, oldValue) {
        this.updateLocalRefreshedAt(newValue)
      }
    },

    methods: {
      copyBalance (account) {
        this.$copyText(account.balance).then((e) => {
          this.copiedBalanceAccount = account

          setTimeout(() => {
            this.copiedBalanceAccount = undefined
          }, 3000)
        })
      },
      async addCredentialsFromUrl (url) {
        const fullUrl = new URL(url)
        const urlParams = new URLSearchParams(fullUrl.search)

        const client = new AuthAPIClient({
          client_id: this.$store.getters.truelayerClientId,
          client_secret: await this.$store.getters.truelayerClientSecret
        })

        let tokens
        let me

        try {
          console.log('exchanging tokens')
          tokens = await client.exchangeCodeForToken('http://localhost/oauth', urlParams.get('code'))
          console.log('tokens', tokens)
        } catch (e) {
          console.log('tokens failure')
          console.log(e.error)
        }

        try {
          console.log('getting me')
          me = await DataAPIClient.getMe(tokens.access_token)
        } catch (e) {
          console.log('me failure')
          console.log(e.error)
        }

        console.log('tokens', tokens)
        console.log('me', me)

        if (tokens && me) {
          this.$store.dispatch('addCredential', {
            refreshToken: tokens.refresh_token,
            credentials: me.results[0]
          })
        }
      },
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
      startTrueLayerAuth () {
        this.$electron.ipcRenderer.sendSync('oauth-start', this.$store.getters.truelayerClientId)
      }
    }

  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
