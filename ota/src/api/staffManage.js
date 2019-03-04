/*
 * @Author: dengdongming
 * @Date: 2018-10-15 13:40
 * @Last Modified by: gww
 * @Last Modified time: 2018-12-10 20:22:02
 */
import { fetch } from '@/utils/fetch'
export const staffManageInfo = {
  requestPath: '/otastarter/user',
  queryMethod: '',
  isMock: true,
  addAccountAPi (params) { // 组织结构
    return fetch(this.requestPath, {
      method: 'add',
      params
    }, {
      isMock: true
    })
  },
  editAccountApi (params) {
    return fetch(this.requestPath, {
      method: 'edit',
      params
    }, {
      isMock: true
    })
  },
  changeAccountStatusApi (params) {
    return fetch(this.requestPath, {
      method: 'changeAccountStatus',
      params
    }, {
      isMock: true
    })
  }

}
// 员工分配房源
export function distributeHouseToUserApi (params = {}) {
  return fetch('/otastarter/fangyuanDistribute/distributeHouseToUser', {
    params
  }, {
    isMock: true
  })
}
// 部门分配房源
export function distributeHouseToDepApi (params = {}) {
  return fetch('/otastarter/fangyuanDistribute/distributeHouseToDep', {
    params
  }, {
    isMock: true
  })
}
// 取消给部门分配房源
export function cancleHouseToDepApi (params = {}) {
  return fetch('/otastarter/fangyuanDistribute/cancleHouseToDep', {
    params
  }, {
    isMock: true
  })
}
// 取消给员工分配房源
export function cancleHouseToUserApi (params = {}) {
  return fetch('/otastarter/fangyuanDistribute/cancleHouseToUser', {
    params
  }, {
    isMock: true
  })
}
