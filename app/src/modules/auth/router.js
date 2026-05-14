import store from '@/store'
import AcceptInvite from './components/AcceptInvite.vue'
import SiteLogin from './components/SiteLogin.vue'

export default [
  {
    path: '/login',
    name: 'SiteLogin',
    title: 'Login',
    component: SiteLogin,
  },
  {
    path: '/invite/:token',
    name: 'AcceptInvite',
    title: 'Create Account',
    component: AcceptInvite,
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
