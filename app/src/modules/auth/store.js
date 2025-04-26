import axios from 'axios'
import axiosWrapper from '@/util/axiosWrapper.js'


function getCachedUser() {
  const userString = localStorage.getItem('auth.user')
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
  localStorage.setItem('auth.user', JSON.stringify(user))
}


export default {
  namespaced: true,

  state: () => ({
    status: '',
    user: getCachedUser(),
  }),

  getters: {
    isLoggedIn: state => !!state.user.token,
    authStatus: state => state.status,
    user: state => state.user,
    userId: state => state.user._id,
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
      localStorage.removeItem('auth.user')
      delete axios.defaults.headers.common['Authorization']
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
  },
}
