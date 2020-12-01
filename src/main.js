import Vue from 'vue'
import App from './App.vue';
import router from './router.js'
import './plugins/element-ui.js'
import './assets/css/global.css'
import './assets/css/font/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:9000/mall-api/'
axios.interceptors.request.use(config => {
  // 网络请求预处理, 添加 Authorization 验证请求头.
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
