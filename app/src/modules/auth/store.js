import axios from 'axios'
import axiosWrapper from '@/util/axiosWrapper.js'


function getCachedUser() {
  const userString = window.localStorage.getItem('auth.user')
  if (userString) {
    try {
      return JSON.parse(userString)
    }
    catch {
      return {}
    }
  }
  else {
    return {}
  }
}

function setCachedUser(user) {
  window.localStorage.setItem('auth.user', JSON.stringify(user))
}


export default {
  namespaced: true,

  state: () => ({
    status: '',
    user: getCachedUser(),
    impersonation: {
      isImpersonating: false,
      originalUser: null,
      impersonatedUser: null,
    },
  }),

  getters: {
    isLoggedIn: state => !!state.user.token,
    authStatus: state => state.status,
    user: state => state.user,
    userId: state => state.user._id,
    isImpersonating: state => state.impersonation.isImpersonating,
    originalUser: state => state.impersonation.originalUser,
    impersonatedUser: state => state.impersonation.impersonatedUser,
  },

  mutations: {
    auth_error(state) {
      state.status = 'error'
    },

    auth_request(state) {
      state.status = 'loading'
    },

    auth_success(state, user) {
      state.status = 'success'
      state.user = user
      setCachedUser(user)
      axios.defaults.headers.common['Authorization'] = 'bearer ' + user.token
    },

    logout(state) {
      state.status = ''
      state.user = {}
      state.impersonation = {
        isImpersonating: false,
        originalUser: null,
        impersonatedUser: null,
      }
      window.localStorage.removeItem('auth.user')
      delete axios.defaults.headers.common['Authorization']
    },

    start_impersonation(state, { impersonationToken, targetUser, originalUser }) {
      state.impersonation.isImpersonating = true
      state.impersonation.originalUser = originalUser
      state.impersonation.impersonatedUser = targetUser
      // Update the current user to the impersonated user
      state.user = {
        ...targetUser,
        token: impersonationToken,
        _impersonation: {
          isImpersonated: true,
          adminId: originalUser._id,
          impersonationToken: true
        }
      }
      setCachedUser(state.user)
      axios.defaults.headers.common['Authorization'] = 'bearer ' + impersonationToken
    },

    updateUser(state, fields) {
      state.user = { ...state.user, ...fields }
      setCachedUser(state.user)
    },

    stop_impersonation(state, originalUser) {
      state.impersonation.isImpersonating = false
      state.impersonation.originalUser = null
      state.impersonation.impersonatedUser = null
      // Restore the original user
      state.user = originalUser
      setCachedUser(originalUser)
      axios.defaults.headers.common['Authorization'] = 'bearer ' + originalUser.token
    }
  },

  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axiosWrapper
          .post('/api/guest/login', payload)
          .then(resp => {
            const user = resp.user
            commit('auth_success', user)
            resolve(resp)
          })
          .catch(err => {
            commit('logout')
            commit('auth_error')
            reject(err)
          })
      })
    },

    logout({ commit }) {
      return new Promise(resolve => {
        commit('logout')
        resolve()
      })
    },

    async startImpersonation({ commit, state }, targetUserId) {
      try {
        // Store the current user as the original user before starting impersonation
        const originalUser = { ...state.user }

        const response = await axiosWrapper.post('/api/admin/impersonate', {
          targetUserId,
          appVersion: window.APP_VERSION || 1747165976913
        })

        commit('start_impersonation', {
          impersonationToken: response.impersonationToken,
          targetUser: response.targetUser,
          originalUser: originalUser
        })

        return response
      }
      catch (error) {
        console.error('Impersonation failed:', error)
        throw error
      }
    },

    async stopImpersonation({ commit, state }) {
      try {
        const impersonationToken = state.user.token
        await axiosWrapper.post('/api/admin/stop-impersonation', {
          impersonationToken,
          appVersion: window.APP_VERSION || 1747165976913
        })

        commit('stop_impersonation', state.impersonation.originalUser)
      }
      catch (error) {
        console.error('Stop impersonation failed:', error)
        throw error
      }
    },

    async checkImpersonationStatus({ commit, state }) {
      try {
        const response = await axiosWrapper.post('/api/admin/impersonation-status', {
          appVersion: window.APP_VERSION || 1747165976913
        })

        if (response.isImpersonated && !state.impersonation.isImpersonating) {
          // We're impersonating but the store doesn't know about it
          // This can happen on page refresh
          commit('start_impersonation', {
            impersonationToken: state.user.token,
            targetUser: state.user,
            adminUser: response.impersonatedBy
          })
        }

        return response
      }
      catch (error) {
        console.error('Check impersonation status failed:', error)
        throw error
      }
    },
  },
}
