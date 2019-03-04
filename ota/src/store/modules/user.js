/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:09:27
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-15 08:35:27
 */

import { loginApi } from '@/api/user'
import { getSessionId, setSessionId, removeSessionId } from '@/utils/auth'
import defaultAvatar from '@/assets/defaultAvatar.png'
import { SHA2 } from '@/utils/sha'
import Session from '@/utils/session'

const user = {
  state: {
    mobile: '',
    sessionId: getSessionId(),
    roles: null,
    avatar: '',
    userInfo: {
      authed: false,
      idlefished: false,
      authInfo: {}
    }
  },

  mutations: {
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_SESSIONID: (state, sessionId) => {
      state.sessionId = sessionId
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = {}
      state.userInfo = userInfo
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const account = userInfo.mobile.trim()
      return new Promise((resolve, reject) => {
        loginApi.login({
          account,
          password: SHA2(userInfo.password)
        }).then(response => {
          const data = response.data
          if (!data.firstLogin) {
            setSessionId(data.sessionId)
          }
          commit('SET_MOBILE', account)
          commit('SET_SESSIONID', data.sessionId)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginApi.getInfo({
          sessionId: state.sessionId
        }).then(response => {
          const data = response.data || {}
          commit('SET_ROLES', data.role)
          commit('SET_AVATAR', defaultAvatar)
          commit('SET_USERINFO', data)
          commit('SET_MOBILE', data.mobile)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginApi.logout({
          sessionId: state.sessionId
        }).then(() => {
          removeSessionId()
          commit('SET_SESSIONID', '')
          commit('SET_ROLES', null)
          Session.set('visitedViews', [])
          Session.set('cachedViews', [])
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        removeSessionId()
        commit('SET_SESSIONID', '')
        Session.set('visitedViews', [])
        Session.set('cachedViews', [])
        resolve()
      })
    }
  }
}

export default user
