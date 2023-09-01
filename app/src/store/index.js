import { createStore } from 'vuex'

import authStore from '@/modules/auth/store.js'
import magicStore from '@/modules/magic/store'

import axiosWrapper from '../util/axiosWrapper.js'


const postPlugin = (store) => { store.$post = axiosWrapper.post }

export default createStore({
  modules: {
    auth: authStore,
    magic: magicStore,
  },
  plugins: [postPlugin],
})
