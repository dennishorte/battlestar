import { createStore } from 'vuex'

import authStore from '@/modules/auth/store.js'
import magicStore from '@/modules/magic/store'

export default createStore({
  modules: {
    auth: authStore,
    magic: magicStore,
  },
})
