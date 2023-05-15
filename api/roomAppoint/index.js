import request from '../../utils/request';
import {
  POST,
  GET
} from '../../utils/method';

const roomAppoint = {
  get(data) {
    return request({
      url: '/api/room_appoint/getSingleRecord',
      method: GET,
      data,
    })
  }
}

export default roomAppoint;