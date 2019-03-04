
/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 16:33:06
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-01 16:31:48
 */

import { fetch } from '@/utils/fetch'

export const loginApi = {
  requestPath: '/otastarter/user',
  /* 登录获取sessionId */
  login (params = {}) {
    return fetch(this.requestPath, {
      method: 'login',
      params
    }, {
      isMock: true
    })
  },
  /* sessionId获取用户信息 */
  getInfo (params = {}) {
    return fetch(this.requestPath, {
      method: 'info',
      params
    }, {
      isMock: true
    })
  },
  /* 退出系统 */
  logout (params = {}) {
    return fetch(this.requestPath, {
      method: 'quit',
      params
    }, {
      isMock: true
    })
  },
  /* 修改密码 */
  modifyPassword (params = {}) {
    return fetch(this.requestPath, {
      method: 'modifyPassword',
      params
    }, {
      isMock: true
    })
  },
  /* 重置密码 */
  retrievePassword (params = {}) {
    return fetch(this.requestPath, {
      method: 'retrievePassword',
      params
    }, {
      isMock: true
    })
  }
}

/* 实名认证 */
export function certificationFromApi (params) {
  return fetch('/otastarter/user', {
    method: 'auth',
    params
  }, {
    isMock: true
  })
}

/* 实名认证解绑 */
export function certificationUnbindApi (params) {
  return fetch('/otastarter/user', {
    method: 'unauth',
    params
  }, {
    isMock: true
  })
}

/* 发送验证码 */
export function sendVerifyCodeApi (params = {}) {
  return fetch('/otastarter/sms', {
    method: 'verifyCode',
    params
  }, {
    isMock: true
  })
}
