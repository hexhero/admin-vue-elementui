import axios from 'axios'

// 进度条模块
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://localhost:9000/mall-api/'
axios.interceptors.request.use(config => {
  NProgress.start()
  // 网络请求预处理, 添加 Authorization 验证请求头.
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(response =>{
  NProgress.done()
  return response
})

export default axios