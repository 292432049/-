import Mock from 'mockjs'
import userApi from './user'
import exampleApi from './example'
import houseAsyncApi from './houseInfo'
import roomDetailApi from './hostingRoomDetail'

// user
const reg_getUserInfo = /\/user\/info/
const reg_login = /\/user\/login/
const reg_logout = /\/user\/quit/

// example
const reg_example = /\/example\/list/

// houseManage
const reg_houseManage = /\/fangyuan\/queryHostingList\/isMock/
const reg_changeRoomStatus = /\/fangyuan\/changeLeaseStatus\/isMock/
const reg_estateDeleteEstate = /\/fangyuan\/deleteHouse\/isMock/
const reg_queryCityAreaPlot = /\/fangyuan\/queryCityAreaPlot\/isMock/
// 发布 下架
const reg_publishHouseApi = /\/rooms\/published\/isMock/
const reg_unpublishHouseApi = /\/rooms\/offshelf\/isMock/
// 授权
const reg_authorize = /\/account\/binding\/isMock/
const reg_authorizePicture = /\/account\/picture\/isMock/
const reg_authorizeStatus = /\/account\/acquired\/isMock/
// 实名认证
const reg_certificationFrom = /\/user\/auth/

// entryHouse
const reg_roomDetailManage = /\/queryZoneListByAreaId/
// 组织架构
const reg_queryDepartment = /\/department\/getDepartments/
// 组织架构表格数据
const reg_getDepartmentInfo = /\/department\/getDepartmentInfo/
// 创建部门
const reg_addDepartment = /\/department\/addDepartment/
// 编辑部门获取新
const reg_queryOneDepartment = /\/department\/queryOneDepartment/
// 编辑部门
const reg_editDepartment = /\/department\/editDepartment/
// 获取分配房源
const reg_queryDistributeToDepList = /\/fangyuanDistribute\/queryDistributeToDepList\/isMock/
// 确认分配房源
const reg_distributeHouseToDep = /\/fangyuanDistribute\/distributeHouseToDep\/isMock/
// 人员管理获取部门及部门以下人员
const reg_depMembers = /\/department\/depMembers/
// 新增账户
const reg_addAccount = /\/user\/add/
// 给员工分配房源
const reg_distributeHouseToUser = /\/fangyuanDistribute\/distributeHouseToUser\/isMock/
// 外部编号
const reg_queryHostingHouseByOuterHouseUuid = /\/fangyuan\/queryHostingHouseByOuterHouseUuid\/isMock/
// 集中式房源列表
const reg_queryEstateList = /\/fangyuan\/queryEstateList\/isMock/
// 获取房间号
const reg_allRoomByFangyuanCode = /\/fangyuan\/allRoomByFangyuanCode\/isMock/

Mock.mock(reg_getUserInfo, 'post', userApi.getUserInfo)
Mock.mock(reg_login, 'post', userApi.login)
Mock.mock(reg_logout, 'post', userApi.logout)
Mock.mock(reg_example, 'post', exampleApi.list)

Mock.mock(reg_houseManage, 'post', houseAsyncApi.list)
Mock.mock(reg_changeRoomStatus, 'post', houseAsyncApi.changeRoomStatus)
Mock.mock(reg_estateDeleteEstate, 'post', houseAsyncApi.estateDeleteEstate)
Mock.mock(reg_publishHouseApi, 'post', houseAsyncApi.publishHouse)
Mock.mock(reg_unpublishHouseApi, 'post', houseAsyncApi.unpublishHouse)

Mock.mock(reg_roomDetailManage, 'post', roomDetailApi.zoneList)

Mock.mock(reg_queryCityAreaPlot, 'post', houseAsyncApi.queryCityAreaPlot)
Mock.mock(reg_authorize, 'post', houseAsyncApi.authorize)
Mock.mock(reg_authorizePicture, 'post', houseAsyncApi.authorizePicture)
Mock.mock(reg_authorizeStatus, 'post', houseAsyncApi.authorizeStatus)
Mock.mock(reg_certificationFrom, 'post', houseAsyncApi.certificationFrom)

// 门店系统
Mock.mock(reg_queryDepartment, 'post', houseAsyncApi.queryDepartment)
Mock.mock(reg_getDepartmentInfo, 'post', houseAsyncApi.getDepartmentInfo)
Mock.mock(reg_addDepartment, 'post', houseAsyncApi.addDepartment)
Mock.mock(reg_queryOneDepartment, 'post', houseAsyncApi.queryOneDepartment)
Mock.mock(reg_editDepartment, 'post', houseAsyncApi.editDepartment)
Mock.mock(reg_queryDistributeToDepList, 'post', houseAsyncApi.queryDistributeToDepList)
Mock.mock(reg_distributeHouseToDep, 'post', houseAsyncApi.distributeHouseToDep)
Mock.mock(reg_depMembers, 'post', houseAsyncApi.depMembers)
Mock.mock(reg_depMembers, 'post', houseAsyncApi.depMembers)
Mock.mock(reg_addAccount, 'post', houseAsyncApi.addAccount)
Mock.mock(reg_distributeHouseToUser, 'post', houseAsyncApi.distributeHouseToUser)
Mock.mock(reg_queryHostingHouseByOuterHouseUuid, 'post', houseAsyncApi.queryHostingHouseByOuterHouseUuid)
Mock.mock(reg_queryEstateList, 'post', houseAsyncApi.queryEstateList)
Mock.mock(reg_allRoomByFangyuanCode, 'post', houseAsyncApi.allRoomByFangyuanCode)

export default Mock
