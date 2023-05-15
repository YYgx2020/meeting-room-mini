// 会议室类接口
import request from '../../utils/request';
import {
  POST,
  GET
} from '../../utils/method';

const room = {
  add(data) {
    return request({
      url: '/api/room/add',
      method: POST,
      data,
    })
  },

  get(data) {
    return request({
      url: '/api/room/getMiniList',
      method: GET,
      data,
    })
  },

  update(data) {
    return request({
      url: '/api/room/updateRoomInfo',
      method: POST,
      data,
    })
  },

  searchByOrgid(data) {
    return request({
      url: '/api/room/searchByOrgid',
      method: GET,
      data,
    })
  },
}

export default room;