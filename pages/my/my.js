// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.$userInfo ? wx.userInfo : null,
      login: wx.$login,
    })
  },

  // 登录
  login() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 跳转到修改个人信息页面或者登录页面
  navChangePage() {
    if (wx.$login) {
      // 修改个人信息页面
      wx.navigateTo({
        url: '/pages/personal/personal',
      })
    } else {
      this.login();
    }
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗',
      success: res => {
        if (res.confirm) {
          wx.$openid = null;
          wx.$userInfo = null;
          wx.$token = null;
          wx.$login = false;
          // 返回首页
          wx.showToast({
            title: '退出成功',
            mask: true
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 500)
        }
        if (res.cancel) {
          console.log('取消');
        }
      },
    })
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
    this.setData({
      userInfo: wx.$userInfo ? wx.$userInfo : null,
      login: wx.$login,
    })
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