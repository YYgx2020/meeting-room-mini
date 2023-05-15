// pages/roomList/roomList.js
const LIMIT = 10;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomList: [],
    limit: LIMIT, // 一次性获取多少个记录
    offset: 0, // 跳过0个记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      is_organization_admin: wx.$userInfo.is_organization_admin,
    });
  },

  getDataList() {
    let { offset, limit, roomList } = this.data;
    // if (roomList.length !== 0) {
    //   limit = roomList.length;
    // }

    let data = null;
    data = {
      offset,
      limit,
      organization_id: wx.$userInfo.organization_id,
    };

    wx.$api.room.get(data).then((res) => {
      console.log(res);
      this.setData({
        roomList: res.data.result.rows,
      });
    });
  },

  // 跳转到搜索页面
  navToSearch() {
    wx.navigateTo({
      url: '/pages/roomList/components/search/search',
    })
  },

  navToAddRoom() {
    // 跳转到添加会议室页面
    wx.navigateTo({
      url: "/pages/addRoom/addRoom?type=add",
    });
  },

  // 跳转到会议室详情页面
  navToRoomDetail(e) {
    console.log(e);
    wx.$currentRoomInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/roomDetail/roomDetail",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getDataList();
  },

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
