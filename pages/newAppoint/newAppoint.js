// pages/newAppoint/newAppoint.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    submitForm: {
      contact: null,
      phone: null,
      reason: null,
    },
    room: null,
    date: null,
    time: null,
    timestamp: null,
    start_time: null,
    end_time: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      room: options.room,
      date: options.date,
      time: options.time,
      timestamp: options.timestamp,
      start_time: options.time.split('-')[0],
      end_time: options.time.split('-')[1],
    });
  },

  handleInput(e) {
    console.log(e);
    const {
      id
    } = e.currentTarget;
    let {
      value
    } = e.detail;
    value = value.trim();
    console.log("value", value);
    if (!isNaN(value)) {
      value = parseInt(value);
    }
    this.setData({
      [`submitForm.${id}`]: value,
    });
  },

  handleSubmit() {
    const {
      submitForm,
      time,
      timestamp
    } = this.data;
    const currentRoomInfo = wx.$currentRoomInfo;
    const userInfo = wx.$userInfo;
    const {
      id
    } = currentRoomInfo;
    if (
      submitForm.contact === null ||
      submitForm.contact === "" ||
      Number.isNaN(submitForm.contact)
    ) {
      wx.showToast({
        title: "请填写联系人",
        icon: "none",
      });
      this.setData({
        ["submitForm.contact"]: null,
      });
      return;
    }

    if (submitForm.phone === null || submitForm.phone === "") {
      wx.showToast({
        title: "请填写联系方式",
        icon: "none",
      });
      return;
    }
    const data = {
      room_id: id,
      user_id: userInfo.id,
      organization_id: userInfo.organization_id,
      ...submitForm,
      date: timestamp,
      start_time: time.split("-")[0],
      end_time: time.split("-")[1],
      user_openid: userInfo.openid,
    };

    console.log(data);
    if (wx.$userInfo.is_admin) {
      wx.$api.userAppoint.adminAdd(data).then(res => {
        console.log(res);
        wx.navigateBack({
          delta: 1,
        });
        wx.showToast({
          title: res.data.message,
          mask: true,
        });
      })
    } else {
      // 使用模板消息
      wx.requestSubscribeMessage({
        tmplIds: [wx.$msg2({}).templateId],
        success: async (res1) => {
          console.log("授权成功", res1);
          wx.$api.userAppoint
            .add(data)
            .then((res3) => {
              console.log(res3);
              wx.navigateBack({
                delta: 1,
              });
              wx.showToast({
                title: res1.data.message,
                mask: true,
              });
            })
            .catch((err3) => {
              // this.setData({
              //   fillout: true,
              // });
            });
        },
        fail: async (err1) => {
          wx.$api.userAppoint
            .add(data)
            .then((res3) => {
              console.log(res3);
              wx.navigateBack({
                delta: 1,
              });
              wx.showToast({
                title: res1.data.message,
                mask: true,
              });
            })
            .catch((err3) => {
              // this.setData({
              //   fillout: true,
              // });
            });
        },
      });
    }
    // wx.$api.userAppoint.add(data).then(res => {
    //   wx.showToast({
    //     title: '预算成功',
    //     icon: 'none',
    //   });
    //   wx.navigateBack({
    //     delta: 1,
    //   });
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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