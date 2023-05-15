import request from '../../utils/request';
import {
  POST,
  GET
} from '../../utils/method';


const userAppoint = {
  add(data) {
    return request({
      url: '/api/userAppoint/add',
      method: POST,
      data,
    })
  },

  get(data) {
    return request({
      url: '/api/userAppoint/getDateRecord',
      method: GET,
      data,
    })
  },

  update(data) {
    return request({
      url: '/api/userAppoint/update',
      method: POST,
      data,
    })
  },

  getApproval(data) {
    return request({
      url: '/api/userAppoint/getApproval',
      method: GET,
      data,
    })
  },

  adminAdd(data) {
    return request({
      url: '/api/userAppoint/adminAdd',
      method: POST,
      data,
    })
  },

  getLimitList(data) {
    return request({
      url: '/api/userAppoint/getLimitList',
      method: GET,
      data,
    })
  },

  refresh(data) {
    return request({
      url: '/api/userAppoint/refresh',
      method: GET,
      data,
    })
  },

  // 用户取消预约
  cancel(data) {
    return request({
      url: '/api/userAppoint/cancel',
      method: POST,
      data,
    })
  },

  // 获取某条预约的冲突预约
  getConflictAppointRecord(data) {
    return request({
      url: '/api/userAppoint/getConflictAppointRecord',
      method: GET,
      data,
    })
  },
}

export default userAppoint;