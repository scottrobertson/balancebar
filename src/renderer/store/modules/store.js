const {DataAPIClient} = require('truelayer-client')

const state = {
  accounts: undefined,
  lastRefeshedAt: undefined,
  truelayerClientId: undefined,
  truelayerClientSecret: undefined,
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

  addCredentials (state, credentials) {
    if (state.credentials === undefined) {
      state.credentials = []
    }

    state.credentials.push(credentials)
  },

  setLastRefeshedAt (state, timestamp) {
    state.lastRefeshedAt = timestamp
  },

  setTrueLayerCredentials (state, clientId, clientSecret) {
    state.truelayerClientId = clientId
    state.truelayerClientSecret = clientSecret
  }
}

const actions = {
  resetAll ({ commit }) {
    commit('resetCredentials')
    commit('resetAccounts')
    commit('setTrueLayerCredentials', undefined, undefined)
  },

  setTrueLayerCredentials ({ commit }, clientId, clientSecret) {
    commit('setTrueLayerCredentials', clientId, clientSecret)
  },

  // Used for testing
  loadExampleCredentials ({commit, dispatch}) {
    commit('resetCredentials')

    const examples = [{
      access_token: '123',
      credentials_id: '1',
      provider: {
        display_name: 'Monzo',
        icon_url: 'https://truelayer-provider-assets.s3.amazonaws.com/global/icons/monzo.svg',
        provider_id: 'ob-monzo'
      }
    },
    {
      access_token: 'Invalid',
      credentials_id: '2',
      provider: {
        display_name: 'Barclaycard',
        icon_url: 'https://truelayer-provider-assets.s3.amazonaws.com/global/icons/barclaycard.svg',
        provider_id: 'ob-barclaycard'
      }
    }]

    examples.forEach((credentials) => {
      commit('addCredentials', credentials)
    })

    dispatch('refreshAccounts')
  },

  async refreshAccounts ({ state, commit }) {
    commit('resetAccounts')

    const credentials = state.credentials

    if (credentials && credentials.length) {
      credentials.forEach(async (credential) => {
        let accounts

        try {
          console.log(`Fetching accounts for ${credential.credentials_id}`)
          accounts = await DataAPIClient.getAccounts(credential.access_token)
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
              balance = await DataAPIClient.getBalance(credential.access_token, account.account_id)
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

      commit('setLastRefeshedAt', new Date())
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
  lastRefeshedAt (state) {
    return state.lastRefeshedAt
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
