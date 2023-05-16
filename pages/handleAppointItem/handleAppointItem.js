// pages/handleAppointItem/handleAppointItem.js

import dayjs from "dayjs";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentAppointList: null,
    code: null,
    date: null,
    time: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log();
    // const pages = getCurrentPages();
    // const currentPage = pages[pages.length - 2];
    // // console.log(currentPage);
    // let currentAppointList = currentPage.data.currentAppointList;
    // currentAppointList = currentAppointList.map(item => {
    //   item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:mm:ss');
    //   if (item.is_pass === 1) {
    //     item.statusImg = '../../static/images/status/pass.png';
    //   } else if (item.is_pass === 2) {
    //     item.statusImg = '../../static/images/status/no_pass.png';
    //   }
    //   return item;
    // });
    // console.log(currentAppointList);
    console.log(options);
    if (options.entry == "handleAppointment") {
      // console.log(options);
      this.setData({
        code: options.code,
        date: dayjs(new Date(options.date * 1)).format('MM月DD日'),
        room_id: options.room_id,
        start_time: options.start_time,
        end_time: options.end_time,
        time: options.start_time + '-' + options.end_time,
        timeStamp: options.date,
      })
      this.initData1();
    } else {
      this.setData({
        // currentAppointList,
        code: wx.$currentRoomInfo.code,
        date: options.date,
        time: options.time,
        timestamp: options.timestamp,
      });
      this.initData2();
    }
    // if (this.data.entry === 'handleAppointment') {
    //   this.initData1();
    // } else {
    //   this.initData2();
    // }
  },

  initData1() {
    const data = {
      room_id: this.data.room_id,
      date: this.data.timeStamp,
      start_time: this.data.start_time,
      end_time: this.data.end_time,
    };
    console.log('data: ', data);
    wx.$api.userAppoint.getApproval(data).then((res) => {
      console.log(res);
      const currentAppointList = res.data.result.rows.map((item) => {
        item.createdAt = dayjs(item.createdAt).format(
          "YYYY年MM月DD日 HH:mm:ss"
        );
        if (item.is_pass === 1) {
          item.statusImg = "../../static/images/status/pass.png";
        } else if (item.is_pass === 2) {
          item.statusImg = "../../static/images/status/no_pass.png";
        }
        return item;
      });
      this.setData({
        currentAppointList,
      });
    });
  },

  initData2() {
    const {
      timestamp,
      time,
    } = this.data;
    const queryData = {
      date: timestamp,
      room_id: wx.$currentRoomInfo.id,
      start_time: time.split('-')[0],
      end_time: time.split('-')[1],
    }
    console.log(queryData);
    wx.$api.userAppoint.getConflictAppointRecord(queryData).then(res => {
      console.log(res);
      const currentAppointList = res.data.result.rows.map((item) => {
        item.createdAt = dayjs(item.createdAt).format(
          "YYYY年MM月DD日 HH:mm:ss"
        );
        if (item.is_pass === 1) {
          item.statusImg = "../../static/images/status/pass.png";
        } else if (item.is_pass === 2) {
          item.statusImg = "../../static/images/status/no_pass.png";
        }
        return item;
      });
      this.setData({
        // code: res.data.result.rows[0].roomInfo.code,
        // time: start_time + '-' + end_time,
        // date: dayjs(date * 1).format('YYYY年MM月DD日'),
        currentAppointList
      })
    })
  },

  /* 
    更新逻辑：
    当前选中的预约消息更新为通过，其他的为不通过，原因统一写其他预约消息优先度更高
    发送订阅消息，怎么发，通知到每一个用户
  */
  async pass(e) {
    console.log(e);
    let { currentAppointList } = this.data;
    // 传递一个数组
    const { index } = e.currentTarget.dataset;
    wx.showModal({
      title: "设置会议室开门密码",
      // content: '设置密码',
      editable: true,
      placeholderText: "没有密码直接点击确定即可提交",
      success: async (res) => {
        console.log(res);
        if (res.confirm) {
          console.log("用户点击确定");

          for (let i = 0; i < currentAppointList.length; i++) {
            if (i == index && currentAppointList[i].is_pass === 0) {
              try {
                await wx.$api.userAppoint.update({
                  approval_time: new Date(),
                  id: currentAppointList[i].id,
                  is_pass: 1,
                  password: res.content
                });
                const sendData = {
                  openid: currentAppointList[i].user_openid,
                  content: "会议室预约审核结果",
                  result: "通过",
                  name: wx.$userInfo.name,
                  phone: wx.$userInfo.phone,
                };
                wx.cloud
                  .callFunction({
                    name: "sendMsg",
                    data: {
                      openid: currentAppointList[i].user_openid,
                      templateId: wx.$msg2(sendData).templateId,
                      data: wx.$msg2(sendData).data,
                    },
                  })
                  .then((res2) => {
                    console.log("推送消息成功", res2);
                    // 发送订阅消息（审核结果通知）
                  })
                  .catch((err2) => {
                    console.log("推送消息失败", err2);
                  });
              } catch (error) {
                console.log(error);
                return;
              }
            } else if (currentAppointList[i].is_pass === 0 && i !== index) {
              await wx.$api.userAppoint.update({
                approval_time: new Date(),
                id: currentAppointList[i].id,
                is_pass: 2,
                no_pass_reason:
                  "您当前的时间段有多人同时预约，但是其他人预约的优先级更高",
              });
              const sendData = {
                openid: currentAppointList[i].user_openid,
                content: "会议室预约审核结果",
                result: "不通过",
                name: wx.$userInfo.name,
                phone: wx.$userInfo.phone,
              };
              wx.cloud
                .callFunction({
                  name: "sendMsg",
                  data: {
                    openid: currentAppointList[i].user_openid,
                    templateId: wx.$msg2(sendData).templateId,
                    data: wx.$msg2(sendData).data,
                  },
                })
                .then((res2) => {
                  console.log("推送消息成功", res2);
                  // 发送订阅消息（审核结果通知）
                })
                .catch((err2) => {
                  console.log("推送消息失败", err2);
                });
            }
          }
          wx.navigateBack({
            delta: 1,
          });
          wx.showToast({
            title: "审核成功",
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },

  noPass(e) {
    console.log(e);
    let { currentAppointList } = this.data;
    // 传递一个数组
    const { item } = e.currentTarget.dataset;
    if (item.is_pass == 0) {
      this.setData({
        currentItem: item,
      });
      wx.navigateTo({
        url: "/pages/fail/fail?type=appoint",
      });
    } else {
      return;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
