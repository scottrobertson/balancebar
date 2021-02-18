import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: require("@/pages/index").default,
    },
    {
      path: "/connections",
      name: "connections",
      component: require("@/pages/connections").default,
    },
    {
      path: "/truelayer",
      name: "truelayer",
      component: require("@/pages/truelayer").default,
    },
    {
      path: "/transactions/:account_id",
      name: "transactions",
      component: require("@/pages/transactions").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
