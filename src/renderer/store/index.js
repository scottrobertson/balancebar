import Vue from "vue";
import Vuex from "vuex";

import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

const ls = new SecureLS({
  isCompression: false,
  encodingType: "aes",
});

import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState({
      key: "balancebar",
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
  strict: process.env.NODE_ENV !== "production",
});
