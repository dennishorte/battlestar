import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
Vue.config.devtools = true
Vue.config.productionTip = false

// Global Styles
import '@/assets/css/tyrants.css'

import authUtil from '@/modules/auth/util.js'
authUtil.initialize()

import { BootstrapVue } from 'bootstrap-vue'
Vue.use(BootstrapVue)

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
