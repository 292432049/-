/*
 * @Author: dengdongming
 * @Date: 2018-10-10 13:40
 * @Last Modified by: gww
 * @Last Modified time: 2018-12-10 20:22:20
 */
import { fetch } from '@/utils/fetch'
// 组织架构下的表格数据
export const getDepartmentInfo = {
  requestPath: '/otastarter/department',
  queryMethod: 'getDepartmentInfo',
  staffInfoMethod: 'depMembers', // 人员管理 method
  isMock: true,
  queryDepartmentApi (params) { // 组织结构
    return fetch(this.requestPath, {
      method: 'getDepartments',
      params
    }, {
      isMock: true
    })
  },
  createDepartmentApi (params) { // 创建部门
    return fetch(this.requestPath, {
      method: 'addDepartment',
      params
    }, {
      isMock: true
    })
  },
  queryOneDepartmentApi (params) { // 查询一个部门
    return fetch(this.requestPath, {
      method: 'queryOneDepartment',
      params
    }, {
      isMock: true
    })
  },
  editDepartmentApi (params) { // 编辑部门
    return fetch(this.requestPath, {
      method: 'editDepartment',
      params
    }, {
      isMock: true
    })
  },
  depMembersApi (params) { // 获取部门以及部门一下人呀
    return fetch(this.requestPath, {
      method: 'depMembers',
      params
    }, {
      isMock: true
    })
  }
}
// 获取分配部门房源
export const queryDistributeToDepListApi = { // 编辑部门
  requestPath: '/otastarter/fangyuanDistribute/queryDistributeToDepList',
  isMock: true,
  queryDistributeToDep (params = {}) {
    return fetch(this.requestPath, {
      params
    }, {
      isMock: this.isMock
    })
  }
}
// 获取分配人员房源
export const queryDistributeToUserListApi = {
  requestPath: '/otastarter/fangyuanDistribute/queryDistributeToUserList',
  isMock: true,
  queryDistributeToDep (params = {}) {
    return fetch(this.requestPath, {
      params
    }, {
      isMock: this.isMock
    })
  }
}
