import store from '@/store'


const PUBLIC_ROUTES = new Set(['SiteLogin', 'AcceptInvite'])

function canAccess(routeRecord) {
  if (PUBLIC_ROUTES.has(routeRecord.name)) {
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
  const userString = window.localStorage.getItem('auth.user')
  try {
    const user = JSON.parse(userString)
    if (user && user.token) {
      store.commit('auth/auth_success', user)
    }
  }
  catch {
    // Ignore malformed user
  }
}


export default {
  canAccess,
  initialize,
}
