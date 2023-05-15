// pages/forget/forget.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resetForm: {
      phone: null,
      password: null,
      verifyPwd: null,
      email: null,
      verifyCode: null,
    },
    canSendCode: false, // 设置是否可以发送验证码
    captchaTime: 60, // 验证码倒计时
    fillout: false,
    totalCount: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 统一的填写获取
  handleInput(e) {
    console.log(e);
    console.log(this.data.resetForm);
    let {
      resetForm
    } = this.data;
    const id = e.currentTarget.id;
    if (id === 'verifyPwd') {
      if (resetForm.password === null) {
        wx.showModal({
          title: '提示',
          content: '请先填写密码',
        })
      } else if (resetForm.password != e.detail.value) {
        wx.showModal({
          title: '提示',
          content: '请先填写密码',
        })
      }
    }
    this.setData({
      [`resetForm.${e.currentTarget.id}`]: e.detail.value,
    });
    this.formIsFillout();
  },

  // 确认密码的
  handleInput2(e) {
    let {
      resetForm
    } = this.data;
    const id = e.currentTarget.id;
    const value = e.detail.value;
    console.log(id, value);
    if (resetForm.password === null) {
      wx.showModal({
        title: '提示',
        content: '请先填写密码',
        success: res => {
          this.setData({
            [`resetForm.${id}`]: null,
          })
        }
      })
    } else if (resetForm.password != e.detail.value) {
      wx.showModal({
        title: '提示',
        content: '前后密码不一致',
        success: res => {
          this.setData({
            [`resetForm.${id}`]: null,
          })
        }
      })
    }
    this.setData({
      [`resetForm.${id}`]: e.detail.value,
    });
    this.formIsFillout();
  },

  // 判断表单是否填写完毕
  formIsFillout() {
    const {
      resetForm,
      totalCount
    } = this.data;
    let count = 0;
    for (let key in resetForm) {
      const value = resetForm[key];
      // console.log(key, value);
      // console.log(key, addForm[key]);
      // console.log(key == 'type');
      // console.log((key != 'type' && key != 'description'));
      // console.log((value != null && value != ''));
      // console.log((key != 'type' && key != 'description') && (value != null && value != ''));
      // count++;
      if (value != null && value != '') {
        count++;
      }
    }
    console.log(count);
    this.setData({
      fillout: count === totalCount ? true : false,
    });

  },

  // 倒计时函数
  countdownFun60() {
    this.data.interval = setInterval(() => {
      this.setData({
        captchaTime: this.data.captchaTime - 1,
      })
      // this.captchaTime = this.captchaTime - 1;
      if (this.data.captchaTime === 0) {
        clearInterval(this.data.interval);
        this.setData({
          canSendCode: false,
          captchaTime: 60
        })
        // this.canSendCode = false;
        // this.captchaTime = this.fixedSecond2;
      }
    }, 1000);
  },

  // 获取邮箱验证码
  async getCode() {
    let timer1 = null;
    if (this.data.canSendCode) {
      return
    };
    clearTimeout(timer1);
    console.log("邮箱：", this.data.resetForm.email);
    let {
      email
    } = this.data.resetForm;
    console.log("email: ", email);
    // 先查看邮箱是否填写
    if (email === null) {
      wx.showToast({
        title: '请填写邮箱',
        icon: 'error'
      })
      return;
    }
    wx.showLoading({
      title: '验证码获取中'
    })
    let res = await wx.$api.code.getVerifyCode({
      email
    });
    console.log("验证码获取结果：", res);
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '验证码获取成功，请前往邮箱中复制您的验证码'
    })
    // this.canSendCode = true;
    this.setData({
      canSendCode: true,
    })
    this.countdownFun60();
  },

  submitRegister() {
    const {
      resetForm
    } = this.data;
    wx.showLoading({
      title: '密码重置中',
    })
    wx.$api.user.changePassword(resetForm).then(res => {
      console.log(res);
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