// pages/admission/components/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearch: true, // 是否展示日期搜索按钮
    keyWord: null,
    timer: null,
    searching: false, // 是否展示取消图标和取消按钮
    showDateTip: false, // 是否展示带有搜索日期的消息条
    cancelIcon: false, // 是否展示取消图标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 是否展示搜索页面
  showSearch() {
    this.setData({
      showSearch: true,
      searching: true
    })
  },

  // 获取用户输入
  bindinputEvent(e) {
    // console.log(e);
    const {
      value,
    } = e.detail;
    let {
      timer
    } = this.data;
    if (value === '') {
      clearTimeout(timer);
      this.setData({
        searching: false,
        showSearch: true
      })
    } else {
      if (timer) clearTimeout(timer);
      // if (value)
      timer = setTimeout(async () => {
        console.log('发送请求，关键词：', this.data.keyWord);
        try {
          const data = {
            user_id: wx.$userInfo.id,
            keyWord: this.data.keyWord,
          }
          const res = await wx.$api.userAppoint.searchByKeyWord(data);
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      }, 500);
      this.setData({
        keyWord: e.detail.value,
        searching: true,
        showSearch: false,
        timer,
        cancelIcon: true
      })
    }
  },

  // 取消搜索
  cancelSearch() {
    const {
      searching
    } = this.data;
    if (searching) {
      this.setData({
        keyWord: null,
        searching: false,
        cancelIcon: false,
        showSearch: true
      })
    }
  },

  // 返回上一页
  navBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  searchEvent() {
    const {
      keyWord
    } = this.data;
    if (keyWord === null || keyWord === '') {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      })
    }
  },

  // 按日期搜索
  bindDateChange(e) {
    console.log(e);
    const {
      value
    } = e.detail;
    let date = value.split('-');
    // console.log(date);
    date = date[0] + '年' + date[1] + '月' + date[2] + '日';
    this.setData({
      date,
      showDateTip: true,
    })

  },

  // 重新选择日期
  resetDate() {
    this.setData({
      showDateTip: false,
      searching: false,
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