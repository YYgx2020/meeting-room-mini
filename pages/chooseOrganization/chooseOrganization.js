// pages/chooseOrganization/chooseOrganization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: null,
    searching: false,
    timer: null,
    resultData: [],
    chooseId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 跳转到机构入驻申请页面
  navToOrgApplyPage() {
    wx.navigateTo({
      url: '/pages/organization/organization',
    })
  },

  // 获取用户输入
  bindinputEvent(e) {
    console.log(e);
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
      })
    } else {
      if (timer) clearTimeout(timer);
      // if (value)
      timer = setTimeout(() => {
        console.log('发送请求，关键词：', this.data.keyWord);
        wx.$api.organization.search({
          keyWord: this.data.keyWord
        }).then(res => {
          console.log(res);
          // 处理匹配关键词
          const data = res.data.result.map(item => {
            // 把名字拆开
            let names = item.name.split('');
            names = names.map(itm => {
              return {
                text: itm,
                check: this.data.keyWord.includes(itm)
              }
            })
            item.name = names;
            return item;
          })
          this.setData({
            resultData: data,
          })
        })
      }, 500);
      this.setData({
        keyWord: e.detail.value,
        searching: true,
        timer,
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
        resultData: [],
      })
    }
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

  // 点击返回上一页
  back(e) {
    console.log(e);
    const pages = getCurrentPages();
    console.log(pages);
    const prePage = pages[pages.length - 2];
    prePage.data.chooseItem = e.currentTarget.dataset.item;
    // this.setData({
    //   chooseItem: e.currentTarget.dataset.item,
    // })
    wx.navigateBack({
      delta: 1,
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