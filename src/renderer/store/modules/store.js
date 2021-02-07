import { sortBy } from "lodash";
import { storeRefreshToken, deleteTruelayerSecret, storeTruelayerSecret, getTruelayerSecret } from "../../services/secure-storage.js";
import { refreshAllAccounts } from "../../services/accounts.js";

const state = {
  accounts: undefined,
  lastRefreshedAt: undefined,
  truelayerClientId: undefined,
  credentials: undefined,
};

const mutations = {
  resetAccounts(state) {
    state.accounts = undefined;
  },

  resetCredentials(state) {
    state.credentials = undefined;
  },

  setAccounts(state, accounts) {
    state.accounts = accounts;
  },

  deleteCredential(state, credential) {
    if (state.credentials.length === 1) {
      state.credentials = undefined;
    } else {
      const index = state.credentials.findIndex((c) => c.credentials_id === credential.credentials_id);
      state.credentials.splice(index, 1);
    }
  },

  async addCredentials(state, oauth) {
    if (state.credentials === undefined) {
      state.credentials = [];
    }

    state.credentials.push(oauth.credentials);
    await storeRefreshToken(oauth.credentials, oauth.refreshToken);
  },

  setLastRefreshedAt(state, timestamp) {
    state.lastRefreshedAt = timestamp;
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

  addCredential({ commit, dispatch }, credential) {
    commit("addCredentials", credential);
    dispatch("refreshAccounts");
  },

  deleteCredential({ commit, dispatch }, credential) {
    commit("deleteCredential", credential);
  },

  async refreshAccounts({ state, commit }) {
    commit("resetAccounts");
    commit("setLastRefreshedAt", undefined);

    commit("setAccounts", await refreshAllAccounts(state.truelayerClientId, state.credentials));
    commit("setLastRefreshedAt", new Date());
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
  async truelayerClientSecret() {
    return await getTruelayerSecret();
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
