/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:08:41
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-10-19 17:42:56
 */

import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import routerInfo from './modules/routerInfo'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
    routerInfo
  },
  getters
})

export default store
