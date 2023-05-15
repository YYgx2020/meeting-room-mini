// 组织机构类接口
import request from '../../utils/request';
import {
  POST,
  GET
} from '../../utils/method';

const organization = {
  // 创建一条组织机构记录
  createOrganization(data) {
    return request({
      url: '/api/organization/create',
      method: POST,
      data,
    })
  },

  // 获取组织机构记录
  get(data) {
    return request({
      url: '/api/organization/get',
      method: GET,
      data,
    })
  },

  // 获取分页数据
  refresh(data) {
    return request({
      url: '/api/organization/refresh',
      method: GET,
      data,
    })
  },

  // 删除组织机构申请人的信息，更新组织机构信息
  del(data) {
    return request({
      url: '/api/organization/del',
      method: POST,
      data,
    })
  },

  // 审核通过接口
  pass(data) {
    return request({
      url: '/api/organization/pass',
      method: POST,
      data,
    })
  },

  // 按关键词搜索
  search(data) {
    return request({
      url: '/api/organization/search',
      method: GET,
      data,
    })
  }
}

export default organization;