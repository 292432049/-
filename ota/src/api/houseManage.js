import { fetch } from '@/utils/fetch'

export const houseAsyncApi = {
  requestPath: '/otastarter/fangyuan/queryHostingList',
  isMock: true,
  queryActivityListByPage (params = {}) {
    return fetch(this.requestPath, {
      params
    }, {
      isMock: this.isMock
    })
  }
}
/* 修改出租状态 */
export function changeRoomStatusApi (params = {}) {
  return fetch('/otastarter/fangyuan/changeLeaseStatus', {
    params
  }, {
    isMock: true
  })
}
/* 删除房源 */
export function estateDeleteEstateApi (params = {}) {
  return fetch('/otastarter/fangyuan/deleteHouse', {
    params
  }, {
    isMock: true
  })
}
/* 发布房源 */
export function publishHouseApi (params) {
  return fetch('/otastarter/rooms/published', {
    params
  }, {
    isMock: true
  })
}
/* 下架房源 */
export function unPublishHouseApi (params) {
  return fetch('/otastarter/rooms/offshelf', {
    params
  }, {
    isMock: true
  })
}
/* 获取区域 */
export function queryCityAreaPlotApi (params) {
  return fetch('/otastarter/fangyuan/queryCityAreaPlot', {
    params
  }, {
    isMock: true
  })
}
/* 授权 */
export function authorizeApi (params) {
  return fetch('/otastarter/account/binding', {
    params
  }, {
    isMock: true
  })
}

export function authorizePictureApi (params) {
  return fetch('/otastarter/account/picture', {
    params
  }, {
    isMock: true
  })
}

export function authorizeStatusApi (params) {
  return fetch('/otastarter/account/acquired', {
    params
  }, {
    isMock: true
  })
}

/* 账号解绑 */
export function accountUnbindApi (params) {
  return fetch('/otastarter/account/unbind', {
    params
  }, {
    isMock: true
  })
}

/* 集中式删除房间 */
export function deleteRoomApi (params) {
  return fetch('/otastarter/fangyuan/deleteRoom', {
    params
  })
}

/* 集中式根据区id查询板块列表 */
export function estateZoneListByAreaIdApi (params) {
  return fetch('/otastarter/fangyuan/queryZoneListByAreaId', {
    params
  })
}

/* 集中式模糊查询具体位置 */
export function estateAddressByKeywordsApi (params) {
  return fetch('/otastarter/fangyuan/searchAddressByKeyword', {
    params
  })
}

/* 集中式新增小区 */
export function estateNewSubdistrictApi (params) {
  return fetch('/otastarter/fangyuan/addSubdistrict', {
    params
  })
}

/* 分散式查询详情 */
export function hostingHouseInfoApi (params) {
  return fetch('/otastarter/fangyuan/queryHostingHouseInfo', {
    params
  })
}

/* 分散式新增房屋保存 */
export function hostingSaveHouseInfoApi (params) {
  return fetch('/otastarter/fangyuan/saveHostingHouseInfo', {
    params
  })
}

/* 分散式编辑房屋保存 */
export function hostingEditHouseInfoApi (params) {
  return fetch('/otastarter/fangyuan/editHostingHouseInfo', {
    params
  })
}
/* 外部编码 */
export function queryHostingHouseByOuterHouseUuidApi (params) {
  return fetch('/otastarter/fangyuan/queryHostingHouseByOuterHouseUuid', {
    params
  }, {
    isMock: true
  })
}

/* 集中式 */

/* 集中式房间列表 */
export const queryEstateListApi = {
  requestPath: '/otastarter/fangyuan/queryEstateList',
  isMock: true,
  queryActivityListByPage (params = {}) {
    return fetch(this.requestPath, {
      params
    }, {
      isMock: this.isMock
    })
  }
}
/* 集中式查询单个房间 */
export function queryOneEstateRoomApi (params) {
  return fetch('/otastarter/fangyuan/queryOneEstateRoom', {
    params
  }, {
    isMock: true
  })
}
/* 集中式删除房间 */
export function estateDeleteRoomApi (params) {
  return fetch('/otastarter/fangyuan/deleteRoom', {
    params
  }, {
    isMock: true
  })
}
/* 集中式录入 获取房型房间号 */
export function allRoomByFangyuanCodeApi (params) {
  return fetch('/otastarter/fangyuan/allRoomByFangyuanCode', {
    params
  }, {
    isMock: true
  })
}
/* 集中式编辑房间 */
export function editEstateRoomInfoApi (params) {
  return fetch('/otastarter/fangyuan/editEstateRoomInfo', {
    params
  }, {
    isMock: true
  })
}
/* 集中式录入保存公寓 */
export function saveEstateInfoApi (params) {
  return fetch('/otastarter/fangyuan/saveEstateInfo', {
    params
  }, {
    isMock: true
  })
}
/* 集中式编辑公寓 */
export function editEstateInfoApi (params) {
  return fetch('/otastarter/fangyuan/editEstateBasicInfo', {
    params
  }, {
    isMock: true
  })
}
/* 保存房型 */
export function saveRoomTypesApi (params) {
  return fetch('/otastarter/fangyuan/saveRoomTypes', {
    params
  }, {
    isMock: true
  })
}
/* 集中式取消保存 */
export function cancleSaveEstateApi (params) {
  return fetch('/otastarter/fangyuan/cancleSaveEstate', {
    params
  }, {
    isMock: true
  })
}

/* 集中式详情查询 */
export function queryEstateDetailApi (params) {
  return fetch('/otastarter/fangyuan/queryOneFangyuan', {
    params
  }, {
    isMock: true
  })
}

/* 集中式房型查询 */
export function queryEstateTypeApi (params) {
  return fetch('/otastarter/fangyuan/queryEstateRoomTypeList', {
    params
  }, {
    isMock: true
  })
}
