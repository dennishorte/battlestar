import store from '@/store'
import SiteLogin from './components/SiteLogin'

export default [
  {
    path: '/login',
    name: 'SiteLogin',
    title: 'Login',
    component: SiteLogin,
  },
  {
    path: '/logout',
    name: 'SiteLogout',
    component: {
      beforeRouteEnter(to, from, next) {
        store.dispatch("auth/logout")
        next({ path: 'login' })
      }
    }
  },
]
