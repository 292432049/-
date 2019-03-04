/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-10-19 17:33:28
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-10-19 19:55:31
 */
import Session from '@/utils/session'
const routerInfo = {
  state: Session.get('session_routerInfo') || {},
  mutations: {
    SET_ROUTER_INFO: (state, routerInfo) => {
      state.to = routerInfo.to || {}
      state.from = routerInfo.from || {}
      Session.set('session_routerInfo', {
        to: {
          name: state.to.name,
          fullPath: state.to.fullPath,
          meta: state.to.meta
        },
        from: {
          name: state.from.name,
          fullPath: state.from.fullPath,
          meta: state.from.meta
        }
      })
    }
  },
  actions: {
    GetRouterInfo: ({ commit }, routerInfo) => {
      commit('SET_ROUTER_INFO', routerInfo)
    }
  }
}

export default routerInfo
