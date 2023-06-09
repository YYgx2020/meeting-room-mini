// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  navToChangeUserInfoPage(e) {
    console.log(e);
    const key = e.currentTarget.id;
    const value = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: `/pages/changeUserInfo/changeUserInfo?key=${key}&value=${value}`,
    })
  },

  navToForgetPasswordPage() {
    // 跳转到修改密码页面
    wx.navigateTo({
      url: '/pages/forget/forget',
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
      userInfo: wx.$userInfo,
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