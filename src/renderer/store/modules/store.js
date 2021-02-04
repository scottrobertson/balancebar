const {DataAPIClient} = require('truelayer-client')
const keytar = require('keytar')

const state = {
  accounts: undefined,
  lastRefreshedAt: undefined,
  truelayerClientId: undefined,
  credentials: undefined
}

const mutations = {
  resetAccounts (state) {
    state.accounts = undefined
  },

  resetCredentials (state) {
    state.credentials = undefined
  },

  addAccount (state, account) {
    if (state.accounts === undefined) {
      state.accounts = []
    }

    state.accounts.push(account)
  },

  async addCredentials (state, credentials) {
    if (state.credentials === undefined) {
      state.credentials = []
    }

    state.credentials.push(credentials.credentials)

    // Save the accessToken to Keychain
    await keytar.setPassword('balance-menubar', `credentials_${credentials.credentials.credentials_id}`, credentials.accessToken)
  },

  setLastRefreshedAt (state, timestamp) {
    state.lastRefreshedAt = timestamp
  },

  async setTrueLayer (state, truelayer) {
    state.truelayerClientId = truelayer.clientId

    if (truelayer.clientSecret) {
      await keytar.setPassword('balance-menubar', 'truelayer-client-secret', truelayer.clientSecret)
    } else {
      // This happens if we are resetting.
      await keytar.deletePassword('balance-menubar', 'truelayer-client-secret')
    }
  }
}

const actions = {
  resetAll ({ commit }) {
    commit('resetCredentials')
    commit('resetAccounts')
    commit('setTrueLayer', {})
  },

  setTrueLayer ({ commit }, truelayer) {
    commit('setTrueLayer', truelayer)
  },

  // Used for testing
  loadExampleCredentials ({commit, dispatch}) {
    commit('resetCredentials')

    const examples = []

    examples.forEach((credential) => {
      commit('addCredentials', credential)
    })

    dispatch('refreshAccounts')
  },

  async refreshAccounts ({ state, commit }) {
    commit('resetAccounts')

    const credentials = state.credentials

    if (credentials && credentials.length) {
      credentials.forEach(async (credential) => {
        let accounts

        console.log('gettingAccessToken', `credentials_${credential.credentials_id}`)
        const accessToken = await keytar.getPassword('balance-menubar', `credentials_${credential.credentials_id}`)

        try {
          console.log(`Fetching accounts for ${credential.credentials_id}`)
          accounts = await DataAPIClient.getAccounts(accessToken)
        } catch (e) {
          console.log(`Unable to fetch accounts ${credential.credentials_id}`)

          // TODO: find a nicer way to surface this in the UI.
          // For now, add a "fake" account to surface it.
          commit('addAccount', {
            bank: {
              name: credential.provider.display_name,
              logo: credential.provider.icon_url
            },
            name: `Unable to fetch accounts`,
            balance: 'We have not been able to fetch accounts for this bank at this time. Either try again, or reconnect.',
            hasError: true
          })
        }

        if (accounts) {
          accounts.results.forEach(async (account) => {
            console.log(`Fetching balance for ${account.account_id}`)

            let balance

            try {
              balance = await DataAPIClient.getBalance(accessToken, account.account_id)
              balance = new Intl.NumberFormat('gb-EN', { style: 'currency', currency: balance.currency }).format(balance.available)
            } catch (e) {
              console.log(`Account balance fetch failure: ${account.account_id}`)
              balance = 'Unable to get balance'
            }

            commit('addAccount', {
              bank: {
                name: credential.provider.display_name,
                logo: credential.provider.icon_url
              },
              name: account.display_name,
              balance: balance
            })
          })
        }

        // TODO add support for cards, without just copying the code above. getCards/getCardBalance
      })

      commit('setLastRefreshedAt', new Date())
    }
  }
}

const getters = {
  allAccounts (state) {
    return state.accounts
  },
  allCredentials (state) {
    return state.credentials
  },
  lastRefreshedAt (state) {
    return state.lastRefreshedAt
  },
  hasTruelayerClient (state) {
    return state.truelayerClientId !== undefined
  },
  truelayerClientId (state) {
    return state.truelayerClientId
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
