import store from '@/store'
import Login from './view/Login'

export default [
  {
    path: '/login',
    name: 'Login',
    title: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: {
      beforeRouteEnter(to, from, next) {
        store.dispatch("auth/logout")
        next({ path: 'login' })
      }
    }
  },
]
