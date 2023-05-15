// 验证码相关接口
import request from '../../utils/request';
import {
  POST,
  GET
} from '../../utils/method';

const code = {
  getVerifyCode(data) {
    return request({
      url: '/api/code',
      method: GET,
      data,
    })
  },
}

export default code;