import Vue from 'vue'
import App from './App.vue';
import router from './router.js'
import './plugins/element-ui.js'
import './assets/css/global.css'
import './assets/css/font/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:9000/'

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
