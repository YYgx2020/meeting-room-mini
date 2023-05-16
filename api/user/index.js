// 用户类接口
import request from '../../utils/request';
import {
  POST,
  GET
} from '../../utils/method';

const user = {
  // 创建一条组织机构记录
  login(data) {
    // console.log(POST, GET);
    return request({
      url: '/api/user/login',
      method: POST,
      data,
    })
  },

  register(data) {
    return request({
      url: '/api/user/register',
      method: POST,
      data,
    })
  },

  // 获取用户数据
  get(data) {
    return request({
      url: '/api/user/get',
      method: GET,
      data,
    })
  },
  
  refresh(data) {
    return request({
      url: '/api/user/refresh',
      method: GET,
      data,
    })
  },

  pass(data) {
    return request({
      url: '/api/user/pass',
      method: POST,
      data,
    })
  },

  del(data) {
    return request({
      url: '/api/user/del',
      method: POST,
      data,
    })
  },

  changePassword(data) {
    return request({
      url: '/api/user/changePassword',
      method: POST,
      data,
    })
  },

  updateUserInfo(data) {
    return request({
      url: '/api/user/updateUserInfo',
      method: POST,
      data,
    })
  }
}

export default user;