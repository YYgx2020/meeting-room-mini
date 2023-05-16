// pages/roomDetail/roomDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    btnListTouch: false, // 弹出层的判断标签
    isNone: false, // 处理预约 && 查看预约详情 弹出层的 弹出标志
    startTimeArr2: [
      [
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
      ],
      ["00", "30"],
    ], // 增加时间的选择器
    navId: 0, // 导航标识
    current: 0, // swiper的索引，默认显示第一个
    weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], // 周表
    defaultAppoint: [
      {
        time: {
          startTime: "08:00",
          endTime: "10:00",
        },
        detail: [],
        status: "空闲",
      },
      {
        time: {
          startTime: "10:00",
          endTime: "12:00",
        },
        detail: [],
        status: "空闲",
      },
      {
        time: {
          startTime: "12:00",
          endTime: "14:00",
        },
        detail: [],
        status: "空闲",
      },
      {
        time: {
          startTime: "14:00",
          endTime: "16:00",
        },
        detail: [],
        status: "空闲",
      },
      {
        time: {
          startTime: "16:00",
          endTime: "18:00",
        },
        detail: [],
        status: "空闲",
      },
      {
        time: {
          startTime: "18:00",
          endTime: "20:00",
        },
        detail: [],
        status: "空闲",
      },
      {
        time: {
          startTime: "20:00",
          endTime: "22:00",
        },
        detail: [],
        status: "空闲",
      },
    ], // 一天默认的安排
    dateList: [],
    room_id: null,
    code: null,
    has: false,
    roomAppointList: [],
    currentAppointList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      room_id: wx.$currentRoomInfo.id,
      code: wx.$currentRoomInfo.code,
      is_admin: wx.$userInfo.is_admin,
    });
    this.getDefaultDate();
    // 获取第一天的
  },

  initFirstDay() {
    const { current, dateList } = this.data;
    this.handleShowAppointInfo(dateList[current].timeStamp);
  },

  // 点击跳转到查看更多页面
  handleLookMore() {
    let type = "";
    if (wx.$userInfo.is_admin) {
      type = "edit";
    } else {
      type = "look";
    }
    wx.navigateTo({
      url: `/pages/addRoom/addRoom?type=${type}`,
    });
  },

  // 导航栏点击事件
  changeNav(e) {
    const { dateList } = this.data;
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId * 1,
      current: navId * 1,
    });
    // 该日期的预约信息也要改变
    // this.handleShowAppointInfo('undefined');
    // 获取当前日期下该会议室的预约情况，如果有，则使用新的预约情况，否则使用旧的预约表
    // 先获取当前日期
    this.handleShowAppointInfo(dateList[navId].timeStamp);
  },

  // 监听swiper变换事件
  swiperChange(e) {
    // 变换之后查看当前页的安排是程序自动生成的还是数据库中有安排的
    console.log(e);
    const current = e.detail.current;
    const { dateList } = this.data;
    this.setData({
      addNewAppoint: true,
      current,
      navId: current,
    });
    this.handleShowAppointInfo(dateList[current].timeStamp);
  },

  // 获取七天后的日期
  getDefaultDate() {
    const { weekday } = this.data;
    const myDate = new Date(); // 获取今天的日期
    const dateList = [];
    for (let i = 0; i < 7; i++) {
      let currentWeekday = myDate.getDay();
      weekday.forEach((item, index) => {
        if (currentWeekday === index) {
          currentWeekday = item;
        }
      });
      let dateTemp =
        myDate.getMonth() + 1 + "/" + myDate.getDate() + " " + currentWeekday;
      let timeStamp = new Date(
        myDate.getFullYear() +
          "-" +
          (myDate.getMonth() + 1) +
          "-" +
          myDate.getDate()
      ).getTime();
      dateList.push({
        id: i,
        date: dateTemp,
        timeStamp, // 增加一个时间戳，方便后续处理预约信息时进行时间的对比
      });
      myDate.setDate(myDate.getDate() + 1);
    }
    this.setData({
      dateList,
    });
  },

  // 预约信息处理
  // 传入当前日期
  handleShowAppointInfo(timeStamp) {
    // 发送网络请求，获取该会议室，当前日期下的预约情况
    let { room_id, defaultAppoint, roomAppointList } = this.data;
    wx.$api.userAppoint
      .get({
        room_id,
        date: timeStamp,
      })
      .then((res) => {
        console.log(room_id, timeStamp);
        console.log(res);
        console.log(res.data.result.count);
        if (res.data.result.count) {
          // 更新预约记录表
          roomAppointList = JSON.parse(JSON.stringify(defaultAppoint));
          let rows = res.data.result.rows;
          for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < defaultAppoint.length; j++) {
              // console.log(rows[i]);
              // console.log(defaultAppoint[j]);
              if (
                rows[i].start_time == defaultAppoint[j].time.startTime &&
                rows[i].end_time == defaultAppoint[j].time.endTime
              ) {
                roomAppointList[j].detail.push(rows[i]);
                // roomAppointList[j].status = '已预约';
                break;
              }
            }
          }

          roomAppointList = roomAppointList.map((item) => {
            if (item.detail.length !== 0) {
              // 查看有没有已经取消的
              let cancel = 0;
              for (let i = 0; i < item.detail.length; i++) {
                if (item.detail[i].is_pass == 1) {
                  item.detail = item.detail[i];
                  item.isban = true;
                  item.hasDealAll = true;
                  item.isAppointed = true;
                  item.status = "已预约";
                  break;
                } else if (item.detail[i].is_pass == 0) {
                  item.hasDealAll = false;
                  item.isban = false;
                  item.status = "空闲";
                  item.isAppointed = false;
                  break;
                } else if (item.detail[i].is_pass == 3) {
                  cancel++;
                }
              }
              console.log(cancel);
              if (cancel == item.detail.length) {
                // console.log(123121);
                // item.hasDealAll = true;
                // item.isAppointed = false;
                // item.isban = false;
                // item.status = '空闲';
                item.detail = [];
                item.isban = false;
                item.status = "空闲";
                console.log(item);
              }
            } else {
              item.isban = false;
              item.status = "空闲";
            }
            console.log(item);
            return item;
          });

          // console.log(roomAppointList);
          this.setData({
            roomAppointList,
            has: true,
          });
        } else {
          // 使用默认的日期安排
          this.setData({
            has: false,
          });
          this.initDefaultAppoint();
        }
      });
  },

  initDefaultAppoint() {
    // if (current == undefined) {
    //   current = 0;
    // }
    let { current } = this.data;
    let currentHour = new Date().getHours();
    let { defaultAppoint } = this.data;
    if (current === 0) {
      defaultAppoint.forEach((item) => {
        if (item.time.endTime.split(":")[0] * 1 <= currentHour) {
          item["isban"] = true;
        } else {
          item["isban"] = false;
        }
        item["detail"] = [];
        item["isAppointed"] = false;
        item.status = "空闲";
      });
    } else {
      defaultAppoint.forEach((item) => {
        item["detail"] = [];
        item["isban"] = false;
        item["isAppointed"] = false;
        item.status = "空闲";
      });
    }
    this.setData({
      defaultAppoint,
    });
  },

  // 新建预约
  newAppoint(e) {
    console.log(e);
    const { dateList, current, code, roomAppointList } = this.data;
    const { item, index } = e.currentTarget.dataset;
    if (item.detail.length !== 0) {
      if (item.hasDealAll && item.isAppointed) {
        // 下弹窗弹出提示会议室预约情况
        // 筛选出通过的那条消息
        // console.log(item.detail);
        // const appointInfo = item.detail.filter(item => item.ispass == 1);
        wx.showModal({
          title: "预约信息",
          content: `预约人：${item.detail.contact}\r\n电话：${item.detail.phone}`,
        });
        return;
      } else {
        if (this.data.is_admin) {
          // 跳转到预约处理页面
          this.setData({
            currentAppointList: item.detail,
          });
          const date = dateList[current].date;
          const time = item.time.startTime + "-" + item.time.endTime;
          wx.navigateTo({
            url: `/pages/handleAppointItem/handleAppointItem?date=${date}&time=${time}&timestamp=${dateList[current].timeStamp}&entry=roomDetail`,
          });
        } else {
          const date = dateList[current].date;
          const timestamp = dateList[current].timeStamp;
          const time = item.time.startTime + "-" + item.time.endTime;
          wx.navigateTo({
            url: `/pages/newAppoint/newAppoint?date=${date}&room=${code}&time=${time}&timestamp=${timestamp}`,
          });
          return;
        }
      }
    }
    if (item.isban) {
      return;
    } else {
      const date = dateList[current].date;
      const timestamp = dateList[current].timeStamp;
      const time = item.time.startTime + "-" + item.time.endTime;
      wx.navigateTo({
        url: `/pages/newAppoint/newAppoint?date=${date}&room=${code}&time=${time}&timestamp=${timestamp}`,
      });
    }
  },

  // 蒙板点击事件
  backgroundCoverTouch() {
    // 设置导航栏的颜色，让其与背景蒙版的颜色一致
    wx.setNavigationBarColor({
      backgroundColor: "#ffffff",
      frontColor: "#000000",
    });
    this.setData({
      isup: false,
      btnListTouch: false,
      // btnBottom1: '-600rpx',
      isNone: false,
    });
  },

  // 查看预约的确定按钮
  handleConfirm() {
    this.backgroundCoverTouch();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initFirstDay();
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
