// pages/roomList/components/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], // 周表
    selectedDate: '',
    timeStamp: '',
    times: [{
        id: 0,
        value: '08:00-10:00'
      },
      {
        id: 1,
        value: '10:00-12:00'
      },
      {
        id: 2,
        value: '12:00-14:00'
      },
      {
        id: 3,
        value: '14:00-16:00'
      },
      {
        id: 4,
        value: '16:00-18:00'
      },
      {
        id: 5,
        value: '18:00-20:00'
      },
      {
        id: 6,
        value: '20:00-22:00'
      },
    ],
    selectdeTime: '08:00-10:00',
    start_time: '08:00',
    end_time: '10:00',
    searchReasult: [],
    showResult: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDefaultDate();
  },

  // 获取七天后的日期
  getDefaultDate() {
    const {
      weekday
    } = this.data;
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
      selectedDate: dateList[0].date,
      timeStamp: dateList[0].timeStamp,
    });
  },

  // 获取会议室编号和人数
  handleInput(e) {
    const id = e.currentTarget.id;
    const value = e.detail.value;
    this.setData({
      [`${id}`]: value,
    })
  },

  // 日期选择器
  bindDateChange1(e) {
    console.log(e);
    const {
      dateList
    } = this.data;
    let index = e.detail.value * 1;
    this.setData({
      selectedDate: dateList[index].date,
      timeStamp: dateList[index].timeStamp,
    })
  },

  bindDateChange2(e) {
    console.log(e);
    const {
      times
    } = this.data;
    let index = e.detail.value * 1;
    this.setData({
      selectdeTime: times[index].value,
      start_time: times[index].value.split('-')[0],
      end_time: times[index].value.split('-')[1],
    })
  },

  // 查找
  search() {
    let {
      timeStamp,
      code,
      start_time,
      end_time,
      number
    } = this.data;
    console.log(timeStamp, code, start_time, end_time, number);
    // 发请求获取数据
    const data = {
      date: timeStamp,
      code,
      start_time,
      end_time,
      number,
      organization_id: wx.$userInfo.organization_id,
    }
    wx.$api.room.getConditionalQuery(data).then(res => {
      console.log(res.data.result);
      let searchReasult = res.data.result;
      searchReasult = searchReasult.map(item => {
        const appoint_info = item.appoint_info;
        for (let i = 0; i < appoint_info.length; i++) {
          if (appoint_info[i].is_pass === 1) {
            item.status = 1;
            break;
          } else if (appoint_info[i].is_pass === 0) {
            item.status = 0;
            if (wx.$userInfo.is_admin) {
              item.has = true;
            }
          }
        }
        if (item.status == undefined) {
          Object.assign(item, {
            status: 0
          });
        }
        if (appoint_info.length === 0) {
          item.status = 0;
        }
        return item;
      })
      this.setData({
        searchReasult,
        showResult: true,
      });
    })
  },

  // 跳转到会议室预约页面
  toNewAppoint(e) {
    console.log(e);
    let {
      selectedDate,
      selectdeTime,
      timeStamp,
    } = this.data;
    const {
      code,
      status,
      has
    } = e.currentTarget.dataset.item;
    wx.$currentRoomInfo = e.currentTarget.dataset.item;
    if (has) {
      wx.navigateTo({
        url: `/pages/handleAppointItem/handleAppointItem?date=${selectedDate}&time=${selectdeTime}&timestamp=${timeStamp}&entry=roomDetail`,
      });
      
    } else {
      const appointInfo = e.currentTarget.dataset.item.appoint_info.filter(item => item.is_pass == 1);
      console.log(appointInfo[0]);
      if (status === 1) {
        wx.showModal({
          title: "预约信息",
          content: `预约人：${appointInfo[0].contact}\r\n电话：${appointInfo[0].phone}`,
        });
        return;
      }
      wx.navigateTo({
        url: `/pages/newAppoint/newAppoint?date=${selectedDate}&room=${code}&time=${selectdeTime}&timestamp=${timeStamp}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})