import axios from 'axios'


export default {
  namespaced: true,

  state: () => ({
    status: '',
    token: localStorage.getItem('auth.token') || '',
  }),

  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },

  mutations: {
    auth_error(state) {
      state.status = 'error'
    },

    auth_request(state) {
      state.status = 'loading'
    },

    auth_success(state, token) {
      state.status = 'success'
      state.token = token
      localStorage.setItem('auth_token', token)
      axios.defaults.headers.common['Authorization'] = 'bearer ' + token
    },

    logout(state) {
      state.status = ''
      state.token = ''
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
    }
  },

  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: '/api/guest/login',
          method: 'POST',
          data: user,
        })
          .then(resp => {
            const token = resp.data.token
            commit('auth_success', token)
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
