// pages/fail/fail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: null,
    value: null,
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      type: options.type,
    })
    // let pages = getCurrentPages();
    // let prePages = pages[pages.length - 2];
    // console.log(prePages.data);
  },

  handleInput(e) {
    console.log(e);
    const value = e.detail.value;
    this.setData({
      value,
    })
  },

  submitEvent() {
    // 获取上一个页面的信息
    // wx.getCurrentPages().then(res => {
    //   console.log(res);
    // })
    // console.log();
    const {
      value,
      type,
    } = this.data;
    let pages = getCurrentPages();
    let prePages = pages[pages.length - 2];
    console.log(prePages.data);
    const {
      currentItem
    } = prePages.data;
    console.log(currentItem);
    /* 
      更新流程：
      如果点击确定，则返回上一个页面，并且重新获取数据。
      更新数据库数据，organization 更新该组织机构的信息
      {
        id,
        phone(删除管理员信息),
        is_pass,
        no_pass_reason,
        is_delete: true,
      }
    */
    // 更新用户信息
    if (type === 'user') {
      const data = {
        phone: currentItem.phone,
        email: currentItem.email,
        reason: value,
        admin: wx.$userInfo.name,
        admin_phone: wx.$userInfo.phone,
        email: currentItem.email,
      };
      wx.showLoading({
        title: '数据更新中',
      })
      wx.$api.user.del(data).then(res => {
        wx.navigateBack({
          delta: 1,
        })
        // 发送订阅消息（审核结果通知）
        wx.showToast({
          title: '审核成功',
          mask: true,
        })
      }).catch(err => {
        wx.showModal({
          title: '提示',
          content: '审核失败，请重新尝试',
        })
      })
    } else if (type == 'organization') {
      const data = {
        id: currentItem.id,
        is_pass: -1,
        no_pass_reason: value,
        is_delete: 1,
        phone: currentItem.phone,
        reason: value,
        admin: wx.$userInfo.name,
        admin_phone: wx.$userInfo.name
      };
      wx.showLoading({
        title: '数据更新中',
      })
      wx.$api.organization.del(data).then(res => {
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: '审核成功',
          mask: true,
        })
      }).catch(err => {
      })
    } else if (type === 'appoint') {
      const pages = getCurrentPages();
      const prePage = pages[pages.length - 2];
      const item = prePage.data.currentItem;
      const data = {
        id: item.id,
        is_pass: 2,
        no_pass_reason: value, 
        approval_time: new Date(),
      };
      wx.$api.userAppoint.update(data).then(res => {
        console.log(res);
        const sendData = {
          openid: currentItem.user_openid,
          content: '会议室预约审核结果',
          result: '不通过',
          name: wx.$userInfo.name,
          phone: wx.$userInfo.phone,
        }
        wx.cloud.callFunction({
          name: 'sendMsg',
          data: {
            openid: currentItem.user_openid,
            templateId: wx.$msg2(sendData).templateId,
            data: wx.$msg2(sendData).data,
          }
        }).then(res2 => {
          console.log("推送消息成功", res2);
          // 发送订阅消息（审核结果通知）
        }).catch(err2 => {
          console.log("推送消息失败", err2);
        });
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: '更新成功',
        })
      });
    }
    // const data = {
    //   id: currentItem.id,
    //   is_pass: -1,
    //   no_pass_reason: value,
    //   is_delete: true,
    //   phone: currentItem.phone,
    // };
    // console.log('向后端发送的数据：', data);
    // wx.$api.organization.del(data).then(res => {
    //   console.log(res);
    //   const sendData = {
    //     openid: currentItem.user_openid,
    //     content: '组织机构入驻申请',
    //     result: '不通过',
    //     name: '系统管理员',
    //     phone: wx.$userInfo.phone,
    //   }
    //   console.log(wx.$msg2(sendData).openid);
    //   wx.cloud.callFunction({
    //     name: "sendMsg",
    //     data: {
    //       openid: wx.$msg2(sendData).openid,
    //       templateId: wx.$msg2(sendData).templateId,
    //       data: wx.$msg2(sendData).data,
    //     }
    //   }).then(res2 => {
    //     console.log("推送消息成功", res2)
    //     wx.navigateBack({
    //       delta: 1,
    //     })
    //     // 发送订阅消息（审核结果通知）
    //     wx.showToast({
    //       title: '更新成功',
    //       mask: true,
    //     })
    //   }).catch(err2 => {
    //     console.log("推送消息失败", err2)
    //   })

    // })
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