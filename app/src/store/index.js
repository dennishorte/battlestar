import { createStore } from 'vuex'
import authConfig from '@/modules/auth/store.js'

export default createStore({
  modules: {
    auth: authConfig,
  },
})
