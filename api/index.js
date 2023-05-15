// 引入各接口模块
import organization from './organization/index';
import user from './user/index';
import code from './code/index';
import room from './room/index';
import roomAppoint from './roomAppoint/index';
import userAppoint from './userAppoint/index';

class API {
  constructor () {
      this.organization = organization;
      this.user = user;
      this.code = code;
      this.room = room;
      this.roomAppoint = roomAppoint;
      this.userAppoint = userAppoint;
  }
}

// 导出使用
export default new API();
