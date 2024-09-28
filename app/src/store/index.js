import { createStore } from 'vuex'

import authStore from '@/modules/auth/store.js'
import gameStore from '@/modules/games/common/store.js'
import magicStore from '@/modules/magic/store'

import axiosWrapper from '../util/axiosWrapper.js'


const postPlugin = (store) => { store.$post = axiosWrapper.post }

export default createStore({
  modules: {
    auth: authStore,
    game: gameStore,
    magic: magicStore,
  },
  plugins: [postPlugin],
})
