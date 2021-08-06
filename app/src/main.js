import { BootstrapVue } from 'bootstrap-vue'
import Vue from 'vue'

import App from '@/App.vue'
import UtilPlugin from '@/lib/util.js'
import router from '@/router'
import store from '@/store'
import authUtil from '@/modules/auth/util.js'


Vue.config.devtools = true
Vue.config.productionTip = false

authUtil.initialize()


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(UtilPlugin)


new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
