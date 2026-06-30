import store from '@/store'
import AcceptInvite from './components/AcceptInvite.vue'
import ResetPassword from './components/ResetPassword.vue'
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
    path: '/password-reset/:token',
    name: 'ResetPassword',
    title: 'Reset Password',
    component: ResetPassword,
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
