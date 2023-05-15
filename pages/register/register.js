// pages/register/register.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    role: null,
    organization: "",
    roles: [
      {
        id: 1,
        value: "学生",
        checked: true,
      },
      {
        id: 2,
        value: "教师",
        checked: false,
      },
      {
        id: 3,
        value: "企业员工",
        checked: false,
      },
      {
        id: 4,
        value: "其他用户",
        checked: false,
      },
    ],
    chooseItem: null,
    // registerForm: {
    //   // organization_id: null,
    //   // role: null,
    //   // number: null,
    //   name: null,
    //   phone: null,
    //   email: null,
    //   password: null,
    //   verifyPwd: null,
    //   verifyCode: null,
    //   // openid: null,
    // },
    canSendCode: false, // 设置是否可以发送验证码
    captchaTime: 60, // 验证码倒计时
    fillout: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    const role = options.role * 1;
    const registerForm = {
      organization_id: null,
      name: null,
      phone: null,
      email: null,
      password: null,
      verifyPwd: null,
      verifyCode: null,
    };
    let totalCount = 0;
    if (role == 1) {
      Object.assign(registerForm, {
        number: null,
      });
      totalCount = 8;
    } else if (role === 4) {
      delete registerForm.organization_id;
      totalCount = 6;
    } else {
      totalCount = 7;
    }
    this.setData({
      role,
      totalCount,
      roleText: this.data.roles[options.role * 1 - 1].value,
      registerForm,
    });
  },

  // 跳转到新页面选择用户所属组织
  chooseOrganization() {
    wx.navigateTo({
      url: "/pages/chooseOrganization/chooseOrganization",
    });
  },

  // 统一的输入获取
  handleInput(e) {
    console.log(e);
    console.log(this.data.registerForm);
    let { registerForm } = this.data;
    const id = e.currentTarget.id;
    if (id === "verifyPwd") {
      if (registerForm.password === null) {
        wx.showModal({
          title: "提示",
          content: "请先填写密码",
        });
      } else if (registerForm.password != e.detail.value) {
        wx.showModal({
          title: "提示",
          content: "请先填写密码",
        });
      }
    }
    this.setData({
      [`registerForm.${e.currentTarget.id}`]: e.detail.value,
    });
    this.formIsFillout();
  },

  // 确认密码的
  handleInput2(e) {
    let { registerForm } = this.data;
    const id = e.currentTarget.id;
    const value = e.detail.value;
    console.log(id, value);
    if (registerForm.password === null) {
      wx.showModal({
        title: "提示",
        content: "请先填写密码",
        success: (res) => {
          this.setData({
            [`registerForm.${id}`]: null,
          });
        },
      });
    } else if (registerForm.password != e.detail.value) {
      wx.showModal({
        title: "提示",
        content: "前后密码不一致",
        success: (res) => {
          this.setData({
            [`registerForm.${id}`]: null,
          });
        },
      });
    }
    this.setData({
      [`registerForm.${id}`]: e.detail.value,
    });
    this.formIsFillout();
  },

  // 判断表单是否填写完毕
  formIsFillout() {
    const { registerForm, totalCount } = this.data;
    let count = 0;
    for (let key in registerForm) {
      const value = registerForm[key];
      // console.log(key, value);
      // console.log(key, addForm[key]);
      // console.log(key == 'type');
      // console.log((key != 'type' && key != 'description'));
      // console.log((value != null && value != ''));
      // console.log((key != 'type' && key != 'description') && (value != null && value != ''));
      // count++;
      if (value != null && value != "") {
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
      });
      // this.captchaTime = this.captchaTime - 1;
      if (this.data.captchaTime === 0) {
        clearInterval(this.data.interval);
        this.setData({
          canSendCode: false,
          captchaTime: 60,
        });
        // this.canSendCode = false;
        // this.captchaTime = this.fixedSecond2;
      }
    }, 1000);
  },

  // 获取邮箱验证码
  async getCode() {
    let timer1 = null;
    if (this.data.canSendCode) {
      return;
    }
    clearTimeout(timer1);
    console.log("邮箱：", this.data.registerForm.email);
    let { email } = this.data.registerForm;
    console.log("email: ", email);
    // 先查看邮箱是否填写
    if (email === null) {
      wx.showToast({
        title: "请输入邮箱",
        icon: "error",
      });
      return;
    }
    wx.showLoading({
      title: "验证码获取中",
    });
    let res = await wx.$api.code.getVerifyCode({
      email,
    });
    console.log("验证码获取结果：", res);
    wx.hideLoading();
    wx.showModal({
      title: "提示",
      content: "验证码获取成功，请前往邮箱中复制您的验证码",
    });
    // this.canSendCode = true;
    this.setData({
      canSendCode: true,
    });
    this.countdownFun60();
  },

  // 提交注册信息
  /* 
    提交时，通过邮箱告知用户审核结果
  */
  submitRegister() {
    let { registerForm, fillout } = this.data;
    if (!fillout) return;
    wx.showLoading({
      title: "发送中",
      mask: true,
    });
    wx.cloud
      .callFunction({
        name: "getOpenId",
      })
      .then((res) => {
        console.log(res);
        registerForm.openid = res.result.openid;
        registerForm.role = this.data.role;
        // console.log(registerForm);
        wx.$api.user
          .register(registerForm)
          .then((res) => {
            console.log(registerForm);
            wx.showModal({
              title: "提示",
              content:
                "您的注册申请已提交，请耐心等待管理员审核，审核结果将会下发到您注册填写的邮箱，请注意查收",
              success: (res2) => {
                wx.switchTab({
                  url: "/pages/index/index",
                });
                wx.showToast({
                  title: "提交成功",
                });
              },
            });
          })
          .catch((err) => {
            delete registerForm.openid;
            delete registerForm.role;
            this.setData({
              fillout: true,
              registerForm,
            });
          });
      })
      .catch((err) => {
        wx.showModel({
          title: "提示",
          content: "获取openid失败，请重新打开小程序尝试",
        });
      });
    // registerForm.openid = wx.$openid;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // const pages = getCurrentPages();
    // console.log(pages);
    console.log(this.data);
    let { registerForm } = this.data;
    if (this.data.chooseItem) {
      let organization = this.data.chooseItem.name;
      organization = organization
        .map((item) => {
          return item.text;
        })
        .join("");
      registerForm.organization_id = this.data.chooseItem.id;
      this.setData({
        organization,
        registerForm,
      });
      setTimeout(() => {
        this.formIsFillout();
      }, 500);
    }

    // const nextPage = pages[pages.length - 2];
    // console.log(nextPage);
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
