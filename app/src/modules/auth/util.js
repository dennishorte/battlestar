import store from '@/store'


function canAccess(routeRecord) {
  if (routeRecord.name == 'Login') {
    return true
  }
  else {
    return store.getters['auth/isLoggedIn']
  }
}

/*
   If the user has a locally cached auth token, load it up.
 */
function initialize() {
  const token = localStorage.getItem('auth_token')

  if (token) {
    store.commit('auth/auth_success', token)
  }
}


export default {
  canAccess,
  initialize,
}
