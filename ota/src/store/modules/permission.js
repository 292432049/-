/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:08:54
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-10-18 16:45:36
 */

import {
  asyncRouterMap,
  constantRouterMap
} from '@/router/index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
const hasPermission = (roles, route) => {
  return route.meta && route.meta.role ? route.meta.role.includes(roles) : true
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
const filterAsyncRouter = (asyncRouterMap, roles) => {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({
      commit
    }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles * 1 === 1) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
