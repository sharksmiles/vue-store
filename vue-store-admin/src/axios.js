// src/axios.js
import axios from 'axios'

// 创建一个Axios实例
const instance = axios.create({
  baseURL: 'http://localhost:3600', // 设置基础URL
  timeout: 10000 // 设置请求超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，比如添加token
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      // 根据响应状态码进行不同的处理
      switch (error.response.status) {
        case 401:
          // 未授权，重定向到登录页面
          // window.location.href = '/login'
          break
        case 403:
          // 权限不足
          break
        case 404:
          // 资源未找到
          break
        default:
          // 其他错误
          break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
