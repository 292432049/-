/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-09-17 17:03:04
 * @Last Modified by: FT.FE.Bolin
 * @Last Modified time: 2018-09-17 17:05:50
 */
const houseManage_info = {
  list: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'record': 1,
      'houseList': [{
        'boardCount': 1,
        'chamberCount': 1,
        'fangyuanCode': '111111',
        'idlefishStatus': 1,
        'idlefishfailMessage': '闲鱼失败原因',
        'mailinStatus': 1,
        'mailinfailMessage': '麦邻失败原因',
        'rentPrice': 1700.0,
        'roomArea': 30.0,
        'roomCode': '10003',
        'roomNo': '1幢1单元501',
        'roomStatus': 2,
        'subdistrictName': '花园小区',
        'toiletCount': 1
      },
      {
        'boardCount': 1,
        'chamberCount': 1,
        'fangyuanCode': 'fangyuanCode',
        'idlefishStatus': 2,
        'idlefishfailMessage': '闲鱼发布失败',
        'mailinStatus': 2,
        'mailinfailMessage': '麦邻居发布失败',
        'rentPrice': 1700.0,
        'roomArea': 30.0,
        'roomCode': '10000',
        'roomNo': '302',
        'roomStatus': 9,
        'subdistrictName': '米市巷小区',
        'toiletCount': 1
      },
      {
        'boardCount': 1,
        'chamberCount': 1,
        'fangyuanCode': 'fangyuanCode',
        'idlefishStatus': 5,
        'idlefishfailMessage': '闲鱼发布失败',
        'mailinStatus': 5,
        'mailinfailMessage': '麦邻居发布失败',
        'rentPrice': 1700.0,
        'roomArea': 30.0,
        'roomCode': '1002',
        'roomNo': '302',
        'roomStatus': 2,
        'subdistrictName': '米市巷小区',
        'toiletCount': 1
      },
      {
        'boardCount': 1,
        'chamberCount': 1,
        'fangyuanCode': 'fangyuanCode',
        'idlefishStatus': 5,
        'idlefishfailMessage': '闲鱼发布失败',
        'mailinStatus': 1,
        'mailinfailMessage': '麦邻居发布失败',
        'rentPrice': 1700.0,
        'roomArea': 30.0,
        'roomCode': '1002',
        'roomNo': '302',
        'roomStatus': 2,
        'subdistrictName': '米市巷小区',
        'toiletCount': 1
      },
      {
        'boardCount': 1,
        'chamberCount': 1,
        'fangyuanCode': 'fangyuanCode',
        'idlefishStatus': 9,
        'idlefishfailMessage': '闲鱼发布失败',
        'mailinStatus': 5,
        'mailinfailMessage': '麦邻居发布失败',
        'rentPrice': 1700.0,
        'roomArea': 30.0,
        'roomCode': '1002',
        'roomNo': '302',
        'roomStatus': 2,
        'subdistrictName': '米市巷小区',
        'toiletCount': 1
      }]
    }
  },
  changeRoomStatus: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {}
  },
  estateDeleteEstate: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  publishHouse: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  unpublishHouse: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  queryCityAreaPlot: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'cityList': [{
        'cityId': 111,
        'cityName': '杭州市',
        'regionList': [{
          'areaId': 222,
          'areaName': '西湖区'
        },
        {
          'areaId': 333,
          'areaName': '拱墅区'
        }]
      },
      {
        'cityId': 444,
        'cityName': '北京市',
        'regionList': [{
          'areaId': 555,
          'areaName': '东城区'
        },
        {
          'areaId': 666,
          'areaName': '西城区'
        }]
      }],
      'subdistrictList': [{
        'regionAddressId': 333,
        'areaId': 222,
        'cityId': 111,
        'name': '花园小区'
      }, {
        'regionAddressId': 23132,
        'areaId': 222,
        'cityId': 111,
        'name': ' 西湖小区'
      },
      {
        'regionAddressId': 3567,
        'areaId': 14000,
        'cityId': 444,
        'name': '北京高档小区'
      }, {
        'regionAddressId': 6789,
        'areaId': 666,
        'cityId': 444,
        'name': '北京抵挡小区'
      }
      ]
    }
  },
  authorize: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  authorizePicture: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'picUrl': 'https://fh-online.oss-cn-hangzhou.aliyuncs.com/20180717103426865909'
    }
  },
  authorizeStatus: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  certificationFrom: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  queryDepartment: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'depName': '杭州来去自如房产管理有限公司', // 组织名
      'depId': 1, // 上级组织
      'cityId': 111,
      'children': [{// 组织架构层级
        'depName': '上海分部', // 部门名
        'parentId': 'aaaa', // 上级部门
        'depId': 2, // 部门ID
        'cityId': '444',
        'gmtCreate': '2018-08-08 11:11:11', // 创建时间
        'managedHouse': 100, // 管理的房源数量
        'children': [
          {
            'depName': '徐东地区', // 部门名
            'parentId': 'child1', // 上级部门
            'depId': 3, // 部门ID
            'cityId': '222',
            'gmt_create': '2018-08-08 11:11:11', // 创建时间
            'managedHouse': 100// 管理的房源数量
          }
        ]
      }]
    }
  },
  getDepartmentInfo: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': [{
      'depName': '上海分部', // 部门名
      'parent': '上海分部', // 上级部门
      'depId': 1, // 部门ID
      'provinceId': 150000,
      'cityId': 150500,
      'districtId': 150522,
      'parentId': '2',
      'gmtCreate': '2018-08-08 11:11:11', // 创建时间
      'managedHouse': 100 // 管理的房源数量
    }]
  },
  addDepartment: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
    }
  },
  queryOneDepartment: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'depId': 1,
      'depName': '上海总部',
      'provinceId': 150000,
      'cityId': 150500,
      'districtId': 150522,
      'parentDepId': 3
    }
  },
  editDepartment: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
    }
  },
  queryDistributeToDepList: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'record': 1,
      'houseList': [{
        'fangyuanCode': '130000',
        'subdistrictName': '余杭区-xx苑',
        'roomNo': '302',
        'boardCount': 1,
        'chamberCount': 1,
        'toiletCount': 1,
        'roomCount': 99
      }, {
        'fangyuanCode': '14000',
        'subdistrictName': '西湖小区',
        'roomNo': '303',
        'boardCount': 1,
        'chamberCount': 2,
        'toiletCount': 3,
        'roomCount': 1000
      },
      {
        'fangyuanCode': '140010',
        'subdistrictName': '美丽小区',
        'roomNo': '303',
        'boardCount': 1,
        'chamberCount': 2,
        'toiletCount': 3,
        'roomCount': 1000
      }, {
        'fangyuanCode': '140004',
        'subdistrictName': '拱墅区',
        'roomNo': '303',
        'boardCount': 1,
        'chamberCount': 2,
        'toiletCount': 3,
        'roomCount': 1000
      }]
    }
  },
  distributeHouseToDep: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  depMembers:
    {
      'reqId': null,
      'code': '0',
      'message': '操作成功',
      'data': [{
        'cityId': 111,
        'id': 1,
        'name': '张三',
        'role': 3,
        'depId': 3,
        'depName': '上海分部',
        'gender': 1,
        'mobile': 13089887656,
        'hasAllRoomAuth': 1
      },
      {
        'cityId': 111,
        'id': 2,
        'name': '李四',
        'role': 1,
        'depName': '徐东地区',
        'gender': 2,
        'depId': 2,
        'mobile': 15078667898,
        'hasAllRoomAuth': 0
      },
      {
        'id': 2,
        'name': '李四',
        'role': 2,
        'depName': '徐东地区',
        'gender': 2,
        'depId': 2,
        'mobile': 15078667898,
        'hasAllRoomAuth': 0
      }]

    },
  addAccount: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
    }
  },
  distributeHouseToUser: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': null
  },
  queryHostingHouseByOuterHouseUuid: { // 外部编码
    'code': '0',
    'depId': 1,
    'outerHouseUuid': 'outerHouseUuid',
    'fangyuanCode': '2000023087',
    'orgId': 79,
    'adminUserId': 143,
    'houseRentType': 1,
    'provinceId': 430000,
    'provinceName': null,
    'cityId': 430100,
    'cityName': null,
    'regionId': 430121,
    'regionName': null,
    'zoneId': 0,
    'zoneName': null,
    'subdistrictId': 10784,
    'subdistrictName': '物贸路',
    'subdistrictAddress': '物贸路',
    'buildingName': '2',
    'unitCode': '2',
    'roomNo': '201',
    'chamberCount': 2,
    'boardCount': 2,
    'toiletCount': 2,
    'houseArea': 222,
    'floorName': '2',
    'floorAmount': 2,
    'houseDirection': 1,
    'decorationDegree': 1,
    'facilityItems': '',
    'houseDesc': '',
    'contactName': 'yj',
    'contactGender': 1,
    'contactMobile': '13685772564',
    'tag': null,
    'sourceInfo': null,
    'pictures': null,
    'payOfPayment': 1,
    'depositOfPayment': 1,
    'rent': 1700.0,
    'deposit': 1700.0,
    'hostingRooms': [
      {
        'roomCode': '200061909',
        'fangyuanCode': null,
        'roomName': '房间A',
        'roomArea': 22,
        'roomDirection': 1,
        'roomAttributes': '',
        'payOfPayment': 1,
        'depositOfPayment': 1,
        'rent': 1700.0,
        'deposit': 1700.0,
        'facilityItems': '',
        'pictures': [
          {
            'imageName': '1.png',
            'src': 'src',
            'isBase64': 0
          }
        ]
      },
      {
        'roomCode': '200061910',
        'fangyuanCode': null,
        'roomName': '房间B',
        'roomArea': 22,
        'roomDirection': 1,
        'roomAttributes': '',
        'facilityItems': '',
        'pictures': null
      },
      {
        'roomCode': '200061911',
        'fangyuanCode': null,
        'roomName': '房间C',
        'roomArea': 22,
        'roomDirection': 1,
        'roomAttributes': '',
        'facilityItems': '',
        'pictures': null
      },
      {
        'roomCode': '200061912',
        'fangyuanCode': null,
        'roomName': '房间D',
        'roomArea': 22,
        'roomDirection': 1,
        'roomAttributes': '',
        'facilityItems': '',
        'pictures': null
      },
      {
        'roomCode': '200061913',
        'fangyuanCode': null,
        'roomName': '房间E',
        'roomArea': 22,
        'roomDirection': 1,
        'roomAttributes': '',
        'facilityItems': '',
        'pictures': null
      }
    ]
  },
  queryEstateList: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'record': 1,
      'houseList': [{
        'estateName': '美丽湖畔公寓',
        'roomTypeName': '田园风格',
        'boardCount': 1,
        'chamberCount': 1,
        'fangyuanCode': '124324',
        'idlefishStatus': 1,
        'idlefishfailMessage': '闲鱼失败原因',
        'mailinStatus': 1,
        'mailinfailMessage': '麦邻失败原因',
        'rentPrice': 1700.0,
        'roomArea': 30.0,
        'roomCode': 'roomCode',
        'roomNo': '302',
        'roomStatus': 1,
        'toiletCount': 1,
        'depName': '总部'
      }]
    }
  },
  allRoomByFangyuanCode: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      '1层': [{
        'roomCode': '1-01',
        'roomNo': '101'
      }, {
        'roomCode': '1-02',
        'roomNo': '102'
      },
      {
        'roomCode': '1-03',
        'roomNo': '103'
      }, {
        'roomCode': '1-04',
        'roomNo': '104'
      },
      {
        'roomCode': '1-05',
        'roomNo': '105'
      },
      {
        'roomCode': '1-06',
        'roomNo': '106'
      }, {
        'roomCode': '1-07',
        'roomNo': '107'
      },
      {
        'roomCode': '1-08',
        'roomNo': '108'
      },
      {
        'roomCode': '1-09',
        'roomNo': '109'
      }],
      '2层': [{
        'roomCode': '2-01',
        'roomNo': '201'
      }, {
        'roomCode': '2-02',
        'roomNo': '202'
      },
      {
        'roomCode': '2-03',
        'roomNo': '203'
      }],
      '3层': [{
        'roomCode': '3-01',
        'roomNo': '301'
      }, {
        'roomCode': '3-02',
        'roomNo': '302'
      }]
    }
  }
}

export default {
  list: () => {
    return houseManage_info.list
  },
  changeRoomStatus: () => {
    return houseManage_info.changeRoomStatus
  },
  estateDeleteEstate: () => {
    return houseManage_info.estateDeleteEstate
  },
  publishHouse: () => {
    return houseManage_info.publishHouse
  },
  unpublishHouse: () => {
    return houseManage_info.unpublishHouse
  },
  queryCityAreaPlot: () => {
    return houseManage_info.queryCityAreaPlot
  },
  authorize: () => {
    return houseManage_info.authorize
  },
  authorizePicture: () => {
    return houseManage_info.authorizePicture
  },
  authorizeStatus: () => {
    return houseManage_info.authorizeStatus
  },
  certificationFrom: () => {
    return houseManage_info.certificationFrom
  },
  queryDepartment: () => {
    return houseManage_info.queryDepartment
  },
  getDepartmentInfo: () => {
    return houseManage_info.getDepartmentInfo
  },
  addDepartment: () => {
    return houseManage_info.addDepartment
  },
  queryOneDepartment: () => {
    return houseManage_info.queryOneDepartment
  },
  editDepartment: () => {
    return houseManage_info.editDepartment
  },
  queryDistributeToDepList: () => {
    return houseManage_info.queryDistributeToDepList
  },
  distributeHouseToDep: () => {
    return houseManage_info.distributeHouseToDep
  },
  depMembers: () => {
    return houseManage_info.depMembers
  },
  addAccount: () => {
    return houseManage_info.addAccount
  },
  distributeHouseToUser: () => {
    return houseManage_info.distributeHouseToUser
  },
  queryHostingHouseByOuterHouseUuid: () => {
    return houseManage_info.queryHostingHouseByOuterHouseUuid
  },
  queryEstateList: () => {
    return houseManage_info.queryEstateList
  },
  allRoomByFangyuanCode: () => {
    return houseManage_info.allRoomByFangyuanCode
  }

}
