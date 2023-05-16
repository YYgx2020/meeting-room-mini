// pages/changeUserInfo/changeUserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: null,
    value: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      key: options.key,
      value: options.value,
    });
  },

  handleInput(e) {
    this.setData({
      value: e.detail.value,
    })
  },

  changeUserInfo() {
    const {key, value} = this.data;
    wx.showLoading({
      title: '更新中',
    })
    const data = {
      id: wx.$userInfo.id,
      key,
      value,
    }
    wx.$api.user.updateUserInfo(data).then(res => {
      console.log(res);
      wx.$userInfo = res.data.result;
      wx.navigateBack({
        delta: 1,
      })
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