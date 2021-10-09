import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
Vue.config.devtools = true
Vue.config.productionTip = false

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import authUtil from '@/modules/auth/util.js'
authUtil.initialize()

import { BootstrapVue } from 'bootstrap-vue'
Vue.use(BootstrapVue)

// Game Imports
import GamePlugin from '@/game'
Vue.use(GamePlugin)

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
