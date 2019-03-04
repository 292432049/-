/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:10:13
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-13 16:28:18
 */

import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

/* 防止重复提交，利用axios的cancelToken */
let cancelPromise
let requestPath = {}
const CancelToken = axios.CancelToken

/* 默认请求参数 */
const defaultConfig = {
  version: '1.0',
  timestamp: new Date().getTime(),
  reqId: 'ota',
  sign: 'ota'
}

/* 创建axios实例 */
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/' : process.env.BASE_API, // process.env.BASE_API
  interceptors: true, // 是否开启response拦截器 默认true
  noAssign: false // 请求体是否带defaultConfig 默认false
  // timeout: 5000 // 请求超时时间
})

/* request拦截器 */
service.interceptors.request.use(config => {
  /* 发起请求时，取消掉当前正在进行的相同请求 */
  const dataMethod = config.method.toUpperCase() === 'POST' ? config.data.method : config.params.method
  const requestUrlAndMethod = (config.url.endsWith('/') ? config.url : `${config.url}/`) + dataMethod
  if (requestPath[requestUrlAndMethod]) {
    requestPath[requestUrlAndMethod]('取消重复请求')
    requestPath[requestUrlAndMethod] = cancelPromise
  } else {
    requestPath[requestUrlAndMethod] = cancelPromise
  }
  /* post请求 */
  if (config.method.toUpperCase() === 'POST') {
    if (store.getters.sessionId) {
      config.data['sessionId'] = store.getters.sessionId
    }
    if (!config.noAssign) {
      config.data = Object.assign(config.data, defaultConfig)
    }
  } else {
    if (store.getters.sessionId) {
      config.params['sessionId'] = store.getters.sessionId
    }
    if (!config.noAssign) {
      config.params = Object.assign(config.params, defaultConfig)
    }
  }
  /**
   * 处理mock
   * [process.env.MOCK] config/配置
   * [config.isMock] 请求参数配置
   */
  if (process.env.MOCK && config.isMock) {
    config.url = `${config.url}/${config.data.method || 'isMock'}`
  }
  return config
}, error => {
  Promise.reject(error)
})

/* respone拦截器 */
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.message === '取消重复请求') {
      return Promise.reject(error)
    }
    Message({
      message: '连接服务器失败',
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  }
)

/* 调用退出系统 */
const logOutMethod = () => {
  store.dispatch('FedLogOut').then(() => {
    location.reload() // 为了重新实例化vue-router对象 避免bug
  })
}

/* axios请求体包装 */
const responseMehod = (response, resolve, reject) => {
  const res = response.data
  if (!response.config.interceptors || res.code * 1 === 0) {
    return resolve(res)
  }
  // 数据不存在 || 未登录
  if (res.code * 1 === 1011 || res.code * 1 === 2084) {
    logOutMethod()
  }
  Message({
    message: res.message || '未知错误，请联系管理员',
    type: 'error',
    duration: 5 * 1000
  })
  // sessionId 失效
  if (res.code * 1 === 1016) {
    MessageBox.confirm(`${res.message}，请重新登录`, '提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logOutMethod()
    })
  } else if (res.code * 1 === 1013) {
    MessageBox.alert(`该账号已在其他地方登录，请重新登录`, res.message, {
      confirmButtonText: '重新登录',
      showClose: false,
      type: 'warning'
    }).then(() => {
      logOutMethod()
    })
  }
  return reject(res.message || 'error')
}

const judgeMethod = (url, params, options = {
  method: 'post'
}) => {
  let method = options.method || 'post'
  const requestBody = {
    method,
    url,
    ...options,
    cancelToken: new CancelToken(c => {
      cancelPromise = c
    })
  }
  if (method.toUpperCase() === 'POST') {
    requestBody.data = params
  } else {
    requestBody.params = params
  }
  return new Promise((resolve, reject) => {
    service(requestBody).then(response => {
      responseMehod(response, resolve, reject)
    })
  })
}

export const fetch = judgeMethod
