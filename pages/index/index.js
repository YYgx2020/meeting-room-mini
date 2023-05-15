// pages/index/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImg: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log();
    const swiperImg = [];
    for (let i = 1; i < 6; i++) {
      // https://meeting-mini.oss-cn-guangzhou.aliyuncs.com/swiper/1.jpg
      swiperImg.push(`https://meeting-mini.oss-cn-guangzhou.aliyuncs.com/swiper/${i}.jpg`)
    }
    this.setData({
      swiperImg,
      is_admin: wx.$userInfo ? wx.$userInfo.is_admin : false,
    })
    // 获取用户的 openid
    this.getUserOpenid();
    // 获取用户信息以及登录状态
    console.log('index-onLoad');
  },

  getUserOpenid() {
    wx.cloud.callFunction({
      name: 'getOpenId',
    }).then(res => {
      console.log(res);
      wx.$openid = res.result.openid;
    }).catch(err => {
      wx.showModal({
        title: '提示',
        content: '获取openid失败，请重新打开小程序',
      })
    })
  },

  // 跳转到申请入驻页面
  applyAdmission() {
    wx.navigateTo({
      url: '/pages/organization/organization'
    })
  },

  // 跳转到入驻申请审批页面
  dealAdmissionApply() {
    wx.navigateTo({
      url: '/pages/admission/admission',
    })
  },

  // 未登录状态跳转到登录页面
  nextPage(e) {
    console.log(e);
    // 判断登录状态，如果未登录则跳转到登录页面，登录了则跳转到查看预约页面
    if (wx.$login) {
      wx.navigateTo({
        url: `/pages/${e.currentTarget.id}/${e.currentTarget.id}`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 跳转到用户注册审核页面
  dealUserRegisterPage() {
    wx.navigateTo({
      url: '/pages/registerApply/registerApply',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.$userInfo ? wx.$userInfo : null,
      login: wx.$login,
    })
    console.log('index-onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉刷新');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})