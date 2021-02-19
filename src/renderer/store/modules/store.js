import { sortBy } from "lodash";
import { storeRefreshToken, deleteTruelayerSecret, storeTruelayerSecret, deleteRefreshToken, deleteAccessToken } from "../../services/secure-storage.js";
import { refreshAllAccounts, getAccountTransactions } from "../../services/accounts.js";

const state = {
  accounts: undefined,
  lastRefreshedAt: undefined,
  truelayerClientId: undefined,
  credentials: undefined,
  oAuthConnecting: false,
  transactions: {},
};

const mutations = {
  resetAccounts(state) {
    state.accounts = undefined;
    state.transactions = {};
  },

  async resetCredentials(state) {
    state.credentials.forEach((credential) => {
      deleteRefreshToken(credential);
      deleteAccessToken(credential);
    });

    state.credentials = undefined;
  },

  setAccounts(state, accounts) {
    state.accounts = accounts;
  },

  setConnecting(state, connecting) {
    state.oAuthConnecting = connecting;
  },

  async deleteCredential(state, credential) {
    if (state.credentials.length === 1) {
      state.credentials = undefined;
    } else {
      const index = state.credentials.findIndex((c) => c.credentials_id === credential.credentials_id);
      state.credentials.splice(index, 1);
    }

    await deleteRefreshToken(credential);
    await deleteAccessToken(credential);
  },

  async addCredentials(state, oauth) {
    if (state.credentials === undefined) {
      state.credentials = [];
    }

    // Ensure credentials are never added twice
    const credentialExists = state.credentials.find((c) => c.credentials_id === oauth.credentials.credentials_id);
    if (!credentialExists) {
      state.credentials.push(oauth.credentials);
      await storeRefreshToken(oauth.credentials, oauth.refreshToken);
    }
  },

  setLastRefreshedAt(state, timestamp) {
    state.lastRefreshedAt = timestamp;
  },

  setTransactions(state, { accountId, transactions }) {
    state.transactions[accountId] = transactions;
  },

  async setTrueLayer(state, truelayer) {
    state.truelayerClientId = truelayer.clientId;

    if (truelayer.clientSecret) {
      await storeTruelayerSecret(truelayer.clientSecret);
    } else {
      await deleteTruelayerSecret();
    }
  },
};

const actions = {
  resetAll({ commit }) {
    commit("resetCredentials");
    commit("resetAccounts");
    commit("setTrueLayer", {});
  },

  resetAccounts({ commit }) {
    commit("resetAccounts");
  },

  setTrueLayer({ commit }, truelayer) {
    commit("setTrueLayer", truelayer);
  },

  setConnecting({ commit }, connecting) {
    commit("setConnecting", connecting);
  },

  addCredential({ commit, dispatch }, credential) {
    commit("addCredentials", credential);
    dispatch("refreshAccounts");
  },

  deleteCredential({ commit }, credential) {
    commit("deleteCredential", credential);
  },

  async refreshAccounts({ state, commit, dispatch }) {
    commit("resetAccounts");
    commit("setLastRefreshedAt", undefined);

    const accounts = await refreshAllAccounts(state.truelayerClientId, state.credentials);
    commit("setAccounts", accounts);
    commit("setLastRefreshedAt", new Date());

    accounts.forEach(async (account) => {
      await dispatch("getTransactions", account);
    });
  },

  async getTransactions({ commit, state }, account) {
    if (!state.transactions[account.id]) {
      const credentialsForAccount = state.credentials.find((c) => c.credentials_id === account.credentials_id);
      if (credentialsForAccount) {
        commit("setTransactions", {
          accountId: account.id,
          transactions: await getAccountTransactions(state.truelayerClientId, account, credentialsForAccount),
        });
      }
    }

    return state.transactions[account.id];
  },
};

const getters = {
  allAccounts(state) {
    if (state.accounts) {
      return sortBy(state.accounts, ["bank.name", "name"]);
    }
  },
  allCredentials(state) {
    return state.credentials;
  },
  lastRefreshedAt(state) {
    return state.lastRefreshedAt;
  },
  hasTruelayerClient(state) {
    return state.truelayerClientId !== undefined;
  },
  truelayerClientId(state) {
    return state.truelayerClientId;
  },
  isConnecting(state) {
    return state.oAuthConnecting;
  },
  getAccount: (state) => (id) => {
    return state.accounts.find((account) => account.id === id);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
