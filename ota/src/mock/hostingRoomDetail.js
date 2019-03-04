const roomDetail = {
  roomDetailInfo: {},
  zoneList: {
    'reqId': null,
    'code': '0',
    'message': '操作成功',
    'data': {
      'record': 1,
      'list': [
        {
          zoneId: 740,
          zoneName: '安慧桥'
        },
        {
          zoneId: 741,
          zoneName: '奥林匹克公园'
        }
      ]
    }
  }
}

export default {
  roomDetail: () => {
    return roomDetail.roomInfo
  },
  zoneList: () => {
    return roomDetail.zoneList
  }
}
