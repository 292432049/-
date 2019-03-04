/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:24:18
 * @Last Modified by: gww
 * @Last Modified time: 2019-01-11 13:08:08
 */

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import NProgress from 'nprogress'
// import IconSvg from '@/components/Icon-svg/index.vue'
import { getSessionId } from '@/utils/auth'
import * as filters from './filters'
import VuePreview from '@/components/Preview/plugins'
import VueLazyload from 'vue-lazyload'
import lazyLoadPic from '@/assets/lazyLoad.png'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import 'normalize.css/normalize.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VuePreview)
Vue.use(VueLazyload, {
  /* error: errorPic, */
  loading: lazyLoadPic
})
// Vue.component('icon-svg', IconSvg)

process.env.MOCK && require('./mock')

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 记录路由来源信息
  if (from.name) {
    store.dispatch('GetRouterInfo', { to, from })
  }
  if (getSessionId()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles === null) {
        store.dispatch('GetInfo').then(res => {
          const roles = res.data.role
          if (!roles) {
            ElementUI.Message.error({
              message: '系统错误'
            })
            return
          }
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

Vue.use({
  vm
})
