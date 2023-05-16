// pages/admission/admission.js
import dayjs from 'dayjs';

const LIMIT = 4;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearch: false,
    keyWord: null,
    timer: null,
    searching: false,
    current: 0,
    showDateTip: false,
    offset1: 0, // 跳过 0 个实例
    limit1: LIMIT, // 获取 10 个记录
    // 已审批的数据分页
    offset2: 0, // 跳过 0 个实例
    limit2: LIMIT, // 获取 10 个记录
    waitList: [], // 待审核数据
    approvalList: [], // 已审核数据
    toView1: null,
    toView2: null,
    triggered1: true, // 下拉刷新
    triggered2: false,
    scrollTop1: 0,
    scrollTop2: 0,
    firstIn1: true,
    firstIn2: true,
    currentItem: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getOrganizationList();
  },

  /* 
    数据请求方法，进入页面时先获取待审核记录，
    如果用户点击已审核，则获取已审核数据，
    如果待审核记录有更新，则更新后重新加载数据，
    然后再获取已审核数据，并且连带获取跳过的总数据

    获取数据的接口只有一个，但是怎么去区分到底我该拿哪个数据呢？
    获取传递待审批的数据：
      传递参数：{
        offset: offset1,
        limit: limit1,
        current: 0,
      }
    
    下拉刷新获取更多待审批数据：{
      offset: offset1 + limit1
      limit: limit1 + limit1(加上之前的)
      current: 0
    }

    获取已审批数据：
      传递参数：{
        offset: offset2,
        limit: limit2,
        current: 1,
      }
    
    下拉刷新获取更多已审批数据：
      传递参数：{
        offset: offset2 + limit2,
        limit: limit2 + limit2,
        current: 1,
      }

    用户点击导航切换时如何获取数据
    if (current === 0) {
      offset1 = 0,
      limit1 = limit1,
      current = 0,
    }
  */

  // 下拉刷新1
  async bindrefresherrefresh1(e) {
    console.log(e);
    console.log('下拉刷新数据');
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    // 获取更多数据，然后拼接到原有的数据后面
    let {
      offset1,
      limit1,
      waitList,
      current,
    } = this.data;
    offset1 += limit1;
    limit1 = LIMIT;
    this.setData({
      offset1,
      limit1
    })
    const data = {
      offset: offset1,
      limit: limit1,
      current,
    }
    wx.$api.organization.refresh(data).then(res => {
      console.log(res);
      if (res.data.result.rows.length === 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      } else {
        let newData = JSON.parse(JSON.stringify(res.data.result.rows));
        newData = newData.reverse().map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:mm:ss');
          return item;
        });
        Array.prototype.unshift.apply(waitList, newData);
        this.setData({
          triggered1: false,
          waitList,
        })
      }
    })
  },

  // 下拉刷新2
  async bindrefresherrefresh2(e) {
    console.log(e);
    console.log('下拉刷新数据');
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    // 获取更多数据，然后拼接到原有的数据后面
    let {
      offset2,
      limit2,
      current,
      approvalList,
    } = this.data;
    offset2 += limit2;
    limit2 = LIMIT;
    this.setData({
      offset2,
      limit2
    })
    // 使用新的接口
    const data = {
      offset: offset2,
      limit: limit2,
      current,
    }
    wx.$api.organization.refresh(data).then(res => {
      console.log(res);
      if (res.data.result.rows.length === 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      } else {
        let newData = JSON.parse(JSON.stringify(res.data.result.rows));
        newData = newData.reverse().map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:mm:ss');
          item.approval_time = dayjs(item.approval_time).format('YYYY年MM月DD日 HH:mm:ss');
          console.log('贴上图片');
          if (item.is_pass === 1) {
            item.statusImg = '../../static/images/status/pass.png'
          } else if (item.is_pass === -1) {
            item.statusImg = '../../static/images/status/no_pass.png'
          }
          return item;
        });
        Array.prototype.unshift.apply(approvalList, newData);
        this.setData({
          triggered2: false,
          approvalList,
        })
      }
    })
  },

  // 获取组织机构审核数据
  getOrganizationList() {

    // 先看微信存储中有无保留数据，有则直接从存储中拿
    let {
      offset1,
      limit1,
      offset2,
      limit2,
      current,
      firstIn1,
      firstIn2,
      waitList,
      approvalList,
    } = this.data;
    offset1 = 0;
    offset2 = 0;

    if (waitList.length !== 0) {
      limit1 = waitList.length;
    }

    if (approvalList.length !== 0) {
      limit2 = approvalList.length;
    }

    let data = null;
    if (current == 0) {
      data = {
        offset: offset1,
        limit: limit1,
        current,
      }
    } else {
      data = {
        offset: offset2,
        limit: limit2,
        current,
      }
    }
    wx.$api.organization.get(data).then(res => {
      console.log(res);
      if (current == 0) {
        // 更新待审核数据
        waitList = res.data.result.rows.reverse().map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:mm:ss');
          return item;
        })
        // if (firstIn1) {
        //   console.log('去到底部');
        //   this.setData({
        //     toView1: `item${waitList.length}`,
        //   })
        // }
        if (firstIn1) {
          this.setData({
            waitList,
            toView1: `item${waitList.length}`,
            triggered1: false,
          })
        } else {
          this.setData({
            waitList,
            // toView1: `item${waitList.length}`,
            triggered1: false,
          })
        }
        
      } else {
        // 更新已审核数据
        approvalList = res.data.result.rows.reverse().map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:mm:ss');
          item.approval_time = dayjs(item.approval_time).format('YYYY年MM月DD日 HH:mm:ss');
          if (item.is_pass === 1) {
            item.statusImg = '../../static/images/status/pass.png'
          } else if (item.is_pass === -1) {
            item.statusImg = '../../static/images/status/no_pass.png'
          }
          return item;
        })
        if (firstIn2) {
          this.setData({
            approvalList,
            toView2: `item${approvalList.length}`,
            triggered2: false,
            firstIn2: false,
          })
        } else {
          this.setData({
            approvalList,
            triggered2: false,
          })
        }
      }
    }).catch(err => {
      console.log(err);
    })
  },

  // 跳转到搜索页面
  navSearchPage() {
    wx.navigateTo({
      url: '/pages/admission/components/search/search',
    })
  },

  // 导航切换
  changeNav(e) {
    // console.log(e);
    const current = e.currentTarget.dataset.current * 1;
    if (current == 0) {
      this.setData({
        firstIn1: false,
      })
    } else {
      // this.setData({
      //   firstIn2: false,
      // })
    }
    this.setData({
      current,
    })
    this.getOrganizationList();
  },

  // 监听滑动结束
  binddragend1(e) {
    // console.log(e);
    this.setData({
      scrollTop1: e.detail.scrollTop,
      scrollTop2: e.detail.scrollTop,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('onReady');
    setTimeout(() => {
      wx.createSelectorQuery().select('#scroll1').boundingClientRect(rect => {
        console.log(rect);
        this.setData({
          scrollTop1: rect.height + 200,
          scrollTop2: rect.height + 200,
        })
      }).exec()
    }, 1)
    /* 
      这里有一个影响用户体验的地方，
      就是当用户首次进入当前页面时，会自动滑到底部，
      但是当用户切换到已审核数据时，用户再点击回来查看待审核数据，
      则页面内容的位置发生了改变
    */
    this.getOrganizationList();
  },

  // 通过按钮处理逻辑
  pass(e) {
    console.log(e);
    const currentItem = e.currentTarget.dataset.item;
    const data = {
      id: currentItem.id,
      is_pass: 1,
      phone: currentItem.phone,
      email: currentItem.email,
      admin: wx.$userInfo.name,
      admin_phone: wx.$userInfo.phone,
    }
    wx.$api.organization.pass(data).then(res => {
      // console.log(res);
      // const sendData = {
      //   openid: currentItem.user_openid,
      //   content: '组织机构入驻申请',
      //   result: '通过',
      //   name: '系统管理员',
      //   phone: wx.$userInfo.phone,
      // }
      // // 发送订阅消息
      // wx.cloud.callFunction({
      //   name: "sendMsg",
      //   data: {
      //     openid: wx.$msg2(sendData).openid,
      //     templateId: wx.$msg2(sendData).templateId, 
      //     data: wx.$msg2(sendData).data,
      //   }
      // }).then(res2 => {
      //   console.log("推送消息成功", res2)
      //   // 发送订阅消息（审核结果通知）
      //   wx.showToast({
      //     title: '更新成功',
      //     mask: true,
      //   })
      // }).catch(err2 => {
      //   console.log("推送消息失败", err2)
      // })
      this.getOrganizationList();
    }).catch(err => {
      console.log(err);
      wx.showModal({
        title: '提示',
        content: '审核失败，请重新尝试',
      })
    })
  },

  // 不通过按钮处理逻辑
  noPass(e) {
    console.log(e);
    this.setData({
      currentItem: e.currentTarget.dataset.item,
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/fail/fail?type=organization',
      })
    }, 500);
  },

  // binddragging(e) {
  //   console.log(e);
  // },

  // bindscroll(e) {
  //   console.log(e);
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 重新获取数据
    this.getOrganizationList();
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