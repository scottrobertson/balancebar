import { sortBy } from 'lodash'

const {DataAPIClient, AuthAPIClient} = require('truelayer-client')
const keytar = require('keytar')

const KEYCHAIN_NAMESPACE = 'balance-menubar'

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

    await keytar.setPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials.credentials_id}_refresh_token`, credentials.refreshToken)
  },

  setLastRefreshedAt (state, timestamp) {
    state.lastRefreshedAt = timestamp
  },

  async setTrueLayer (state, truelayer) {
    state.truelayerClientId = truelayer.clientId

    if (truelayer.clientSecret) {
      await keytar.setPassword(KEYCHAIN_NAMESPACE, 'truelayer-client-secret', truelayer.clientSecret)
    } else {
      // This happens if we are resetting.
      await keytar.deletePassword(KEYCHAIN_NAMESPACE, 'truelayer-client-secret')
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

  addCredential ({commit, dispatch}, credential) {
    commit('addCredentials', credential)
    dispatch('refreshAccounts')
  },

  async refreshAccounts ({ state, commit }) {
    commit('resetAccounts')

    const credentials = state.credentials

    if (credentials && credentials.length) {
      credentials.forEach(async (credential) => {
        let accounts
        let accessToken

        const client = new AuthAPIClient({
          client_id: state.truelayerClientId,
          client_secret: await keytar.getPassword(KEYCHAIN_NAMESPACE, 'truelayer-client-secret')
        })

        const refreshToken = await keytar.getPassword(KEYCHAIN_NAMESPACE, `credentials_${credential.credentials_id}_refresh_token`)

        try {
          const refreshedToken = await client.refreshAccessToken(refreshToken)
          accessToken = refreshedToken.access_token
        } catch (e) {
          console.log(e.error)

          commit('addAccount', {
            bank: {
              name: credential.provider.display_name,
              logo: credential.provider.icon_url
            },
            name: 'Cannot access account',
            balance: 'We have been unable to refresh the access tokens, please disconnect and try again..',
            hasError: true
          })
        }

        if (accessToken) {
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
                balance = balance.results[0]

                balance = new Intl.NumberFormat('gb-EN', { style: 'currency', currency: balance.currency }).format(balance.available)
              } catch (e) {
                console.log(`Account balance fetch failure: ${account.account_id}`)
                balance = `Unable to get balance: ${e.error}`
              }

              commit('addAccount', {
                bank: {
                  name: credential.provider.display_name,
                  icon: credential.provider.logo_uri.replace('/logo/', '/icon/'),
                  logo: credential.provider.logo_uri
                },
                name: account.display_name,
                balance: balance
              })
            })
          }
        }

        // TODO add support for cards, without just copying the code above. getCards/getCardBalance
      })

      commit('setLastRefreshedAt', new Date())
    }
  }
}

const getters = {
  allAccounts (state) {
    return sortBy(state.accounts, ['bank.name', 'name'])
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
  },
  async truelayerClientSecret () {
    const secret = await keytar.getPassword(KEYCHAIN_NAMESPACE, 'truelayer-client-secret')
    return secret
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
