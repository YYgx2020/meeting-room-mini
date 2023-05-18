// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginForm: {
      phone: null,
      password: null,
    },
    fillout: false, // 标记是否填写完表单
    showEye: true,
    type: 'password'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  lookPassword() {
    let {
      showEye,
      type,
    } = this.data;
    if (type === 'password') {
      showEye = false;
      type = 'text';
    } else {
      showEye = true;
      type = 'password';
    }
    this.setData({
      showEye,
      type,
    })
  },

  // 获取用户输入
  handleInput(e) {
    const {
      id
    } = e.target;
    let {
      value
    } = e.detail;

    value = value.trim();
    // if (!isNaN(value)) {
    //   value *= 1;
    // }
    value += '';
    this.setData({
      [`loginForm.${id}`]: value,
    })
    // 判断是否输入完毕
    this.formIsFillout();
  },

  // 判断表单是否填写完毕
  formIsFillout() {
    const {
      loginForm
    } = this.data;
    let count = 0;
    for (let key in loginForm) {
      const value = loginForm[key];
      if (key != 'type' && key != 'description' && value != null && value != '') {
        count++;
      }
    }
    this.setData({
      fillout: count === 2 ? true : false,
    })

  },

  // 跳转到注册页面
  toRegisterPage() {
    wx.navigateTo({
      url: '/pages/chooseRole/chooseRole',
    });
  },

  // 跳转到忘记密码页面
  forgetPassword() {
    wx.navigateTo({
      url: '/pages/forget/forget',
    });
  },

  // 登录
  loginEvent() {
    const {
      fillout,
      loginForm
    } = this.data;
    console.log(loginForm);
    if (!fillout) return;
    wx.showLoading({
      title: '正在登录中',
      mask: true,
    })
    wx.$api.user.login(loginForm).then(res => {
      console.log(res);
      // 登录成功之后保存用户信息
      wx.$openid = res.data.result.userInfo.openid;
      wx.$userInfo = res.data.result.userInfo;
      wx.$token = res.data.result.token;
      wx.$login = true;
      // 等登录成功消息显示之后再跳转
      wx.showToast({
        title: '登录成功',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }, 500)
    }).catch(err => {
      console.error(err);
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