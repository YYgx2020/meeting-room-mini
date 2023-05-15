// app.js

// 引入 api 文件夹
import API from './api/index';

const dayjs = require('dayjs');

App({
  onLaunch() {
    // var that = this;
    wx.cloud.init({
      env: 'meeting-0gpffok549a159d3'
    })

    // 设置一些全局变量
    wx.$api = API;  // 全局 api 调用
    wx.$openid = null;  // 用户的 openid，发送订阅消息时用
    wx.$userInfo = null;  // 用户信息
    wx.$token = null;  // 全局 token
    wx.$login = false;  // 全局登录状态
    /* 
      消息模板
      1. 待审核提醒
      2. 审核结果通知
      3. 预约结果通知
      4. 会议室预约消息提醒
    */
    //  1. 待审核提醒
    wx.$msg1 = ({
      openid,
      name,
      type,
      remark
    }) => {
      return {
        templateId: 'cdeB9UrqVtzeD2ure83uaQOlXkmIZ28eDWOYyhnXhGA',
        openid: openid ? openid : null,
        data: {
          thing2: {
            value: name ? name : null,
          },
          time3: {
            // value: '2019年10月1日 15:01'
            value: dayjs(new Date()).format('YYYY年MM月DD日 HH:mm:ss'),
          },
          thing4: {
            value: type ? type : null,
          },
          thing6: {
            value: remark ? remark : null,
          }
        }
      }
    }

    // 2. 审核结果通知
    wx.$msg2 = ({
      openid,
      content,
      result,
      name,
      phone,
    }) => {
      return {
        templateId: '7JK6CWWemf9PLFGkdDDUKimKV6ylX2Vy52zakz7rJzc',
        openid: openid ? openid : null,
        data: {
          thing2: {
            value: content ? content : null,
          },
          phrase1: {
            value: result ? result : null,
          },
          thing46: {
            value: name ? name : null,
          },
          phone_number29: {
            value: phone ? phone : null,
          },
          thing7: {
            value: '如有疑问，请根据上方电话号码联系管理员',
          }
        }
      }
    }
  },
  globalData: {
    isAdmin: false,
    openid: '',
    userInfo: '',
    roomInfo: [],
    adminInfo: [], // 管理员的 openid
    // 黄浩的 o3Eih4hBfwf7VZnk3P7zkP6H4ldY,  我的 o3Eih4kn_apmZslq5B6Y5HTmEWd4, 小星星的 o3Eih4unAn7mRzNknrBs3a_4wqw8， 梁海老师的 o3Eih4oJy0k1aTCTmSeBbNVYu8EM
  }
  // 'o3Eih4oJy0k1aTCTmSeBbNVYu8EM', 'o3Eih4kn_apmZslq5B6Y5HTmEWd4', 'o3Eih4unAn7mRzNknrBs3a_4wqw8', 'o3Eih4hBfwf7VZnk3P7zkP6H4ldY'
})

/**
 * 需要填写电话的页面：
 * 企业员工注册页面 -- pages/registered/registered
 * 企业用户预约页面 -- 
 * 新增教室页面 -- 
 */