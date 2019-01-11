import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { removeToken } from './auth'
// 如果使用java提供的接口baseUrl:process.env.BASE_API
console.log(process.env.BASE_API)
const service = axios.create({
  // baseURL: 'http://10.7.51.37:3000/mock/20',
  baseURL: process.env.BASE_API,
  timeout: 10 * 1000
})
service.defaults.headers['Content-Type'] = 'application/json'
// 请求拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = store.getters.token
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)
// 响应拦截
service.interceptors.response.use(
  response => {
    // code 0:表示成功 其他表示失败
    if (response.data.code === 0) {
      return response
    } else {
      return response
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          removeToken()
          break
        case 404:
          break
        case 500:
          break
        default:
          break
      }
    }
    console.log(`err${error}`)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
