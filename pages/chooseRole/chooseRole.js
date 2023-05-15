// pages/chooseRole/chooseRole.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // roles: ['学生', '教师', '企业员工', '其他用户'],
    roles: [{
      id: 1,
      value: '学生',
      checked: true,
    }, {
      id: 2,
      value: '教师',
      checked: false,
    }, {
      id: 3,
      value: '企业员工',
      checked: false,
    }, {
      id: 4,
      value: '其他用户',
      checked: false,
    }],
    selected: '学生',
    selectedCode: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 获取选中的角色
  radioChange(e) {
    console.log(e);
    this.setData({
      selectedCode: e.detail.value * 1,
    })
  },

  // 获取选中的角色
  bindPickerChange(e) {
    const {
      roles
    } = this.data;
    console.log(e);
    this.setData({
      selected: roles[e.detail.value * 1],
      selectedCode: e.detail.value * 1,
    })
  },

  // 下一步
  nextStep() {
    const {
      selectedCode
    } = this.data;
    wx.navigateTo({
      url: '/pages/register/register?role=' + selectedCode,
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