/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-04-11 17:08:35
 * @Last Modified by: gww
 * @Last Modified time: 2019-02-01 16:38:09
 */

const getters = {
  sidebar: state => state.app.sidebar,
  mobile: state => state.user.mobile,
  sessionId: state => state.user.sessionId,
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.authed ? state.user.userInfo.authInfo.name : '', // 昵称
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  authed: state => state.user.userInfo.authed || false,
  idlefished: state => state.user.userInfo.idlefished || false
}
export default getters
