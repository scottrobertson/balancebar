const state = {
  accounts: null,
  lastRefeshedAt: null,
  credentials: [{
    credentials_id: '123',
    provider: {
      display_name: 'Lloyds',
      icon_url: 'https://truelayer-provider-assets.s3.amazonaws.com/global/icons/lloyds.svg',
      provider_id: 'ob-lloyds'
    }
  },
  {
    credentials_id: '123',
    provider: {
      display_name: 'Barclaycard',
      icon_url: 'https://truelayer-provider-assets.s3.amazonaws.com/global/icons/barclaycard.svg',
      provider_id: 'ob-barclaycard'
    }
  }]
}

const mutations = {
  resetAccounts (state) {
    state.accounts = null
  },

  addAccount (state, account) {
    if (state.accounts === null) {
      state.accounts = []
    }

    state.accounts.push(account)
  },

  setLastRefeshedAt (state, timestamp) {
    state.lastRefeshedAt = timestamp
  }
}

const actions = {
  refreshAccounts ({ state, commit }) {
    commit('resetAccounts')

    const credentials = state.credentials

    if (credentials && credentials.length) {
      credentials.forEach((credential) => {
        // TODO fetch accounts for this credentials
        const accounts = [{
          account_id: '123',
          display_name: 'Current Account'
        }]

        accounts.forEach((account) => {
          // TODO: fetch the balance
          const balance = {
            available: 1234,
            currency: 'GBP'
          }

          commit('addAccount', {
            bank: {
              name: credential.provider.display_name,
              logo: credential.provider.icon_url
            },
            name: account.display_name,
            balance: new Intl.NumberFormat('gb-EN', { style: 'currency', currency: balance.currency }).format(balance.available)
          })
        })
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
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
