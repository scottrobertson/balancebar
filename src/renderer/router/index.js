import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/index').default
    },
    {
      path: '/connections',
      name: 'connections',
      component: require('@/components/connections').default
    },
    {
      path: '/truelayer',
      name: 'truelayer',
      component: require('@/components/truelayer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
