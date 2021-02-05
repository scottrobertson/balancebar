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
        let cards
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
          // Bank Accounts
          if (credential.scopes.includes('accounts')) {
            try {
              console.log(`Fetching accounts for ${credential.credentials_id}`)
              accounts = await DataAPIClient.getAccounts(accessToken)
            } catch (e) {
              console.log(`Unable to fetch accounts ${credential.credentials_id}`)
              commit('addAccount', noBalanceAccount(credential))
            }

            if (accounts) {
              accounts.results.forEach(async (account) => {
                commit('addAccount', await getBalance('account', credential, accessToken, account))
              })
            }
          }

          // Credit Cards
          if (credential.scopes.includes('cards')) {
            try {
              console.log(`Fetching cards for ${credential.credentials_id}`)
              cards = await DataAPIClient.getCards(accessToken)
            } catch (e) {
              console.log(`Unable to fetch cards ${credential.credentials_id}`)
              commit('addAccount', noBalanceAccount(credential))
            }

            if (cards) {
              cards.results.forEach(async (card) => {
                commit('addAccount', await getBalance('card', credential, accessToken, card))
              })
            }
          }
        }
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

function noBalanceAccount (credential) {
  return {
    bank: {
      name: credential.provider.display_name,
      logo: credential.provider.icon_url
    },
    name: `Unable to fetch accounts`,
    balance: 'We have not been able to fetch accounts for this bank at this time. Either try again, or reconnect.',
    hasError: true
  }
}

async function getBalance (type, credential, accessToken, object) {
  console.log(`Fetching balance for ${object.account_id}`)

  let balance

  try {
    if (type === 'account') {
      balance = await DataAPIClient.getBalance(accessToken, object.account_id)
    } else if (type === 'card') {
      balance = await DataAPIClient.getCardBalance(accessToken, object.account_id)
    }

    balance = balance.results[0]

    balance = new Intl.NumberFormat('gb-EN', { style: 'currency', currency: balance.currency }).format(balance.available)
  } catch (e) {
    console.log(`Account balance fetch failure: ${object.account_id}`)
    balance = `Unable to get balance: ${e.error}`
  }

  return {
    bank: {
      name: credential.provider.display_name,
      icon: credential.provider.logo_uri.replace('/logo/', '/icon/'),
      logo: credential.provider.logo_uri
    },
    name: object.display_name,
    balance: balance
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
