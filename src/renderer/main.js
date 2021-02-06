import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";

import VueClipboard from "vue-clipboard2";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(require("vue-moment"));

VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);

require("./stylesheets/application.css");

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
