// pages/organization/organization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: [{
      id: 1,
      value: '学校',
      checked: true,
    }, {
      id: 2,
      value: '企业',
      checked: false,
    }],
    addForm: {
      organizationName: null, // 组织机构名称
      type: 1, // 组织机构类型（默认是1，即学校）
      description: null, // 组织机构描述信息
      name: null, // 申请人姓名
      phone: null, // 申请人电话
      email: null, // 申请人邮箱
      password: null, // 申请人密码
      verifyPwd: null, // 确认密码
      openid: null,
      verifyCode: null,
    },
    fillout: false,
    canSendCode: false, // 设置是否可以发送验证码
    captchaTime: 60, // 验证码倒计时

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 统一获取用户输入
  handleInput(e) {
    console.log(e);
    const {
      id
    } = e.target;
    let {
      value
    } = e.detail;

    value = value.trim();

    if (!isNaN(value)) {
      value *= 1;
    }
    // 判断是否输入完毕
    // console.log(addForm);
    // console.log('value: ', value);
    this.setData({
      [`addForm.${id}`]: value,
    })
    this.formIsFillout();
  },

  // 判断表单是否填写完毕
  formIsFillout() {
    const {
      addForm
    } = this.data;
    let count = 0;
    for (let key in addForm) {
      // console.log(key, value);
      // console.log(key, addForm[key]);
      // console.log(key == 'type');
      // console.log((key != 'type' && key != 'description'));
      // console.log((value != null && value != ''));
      // console.log((key != 'type' && key != 'description') && (value != null && value != ''));
      const value = addForm[key];
      if (key != 'type' && key != 'description' && key != 'openid' && value != null && value != '') {
        count++;
        // console.log(count);
      }
    }
    console.log(count);
    this.setData({
      fillout: count === 7 ? true : false,
    })

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
    console.log("邮箱：", this.data.addForm.email);
    let {
      email
    } = this.data.addForm;
    console.log("email: ", email);
    // 先查看邮箱是否填写
    if (email === null) {
      wx.showToast({
        title: '请输入邮箱',
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

  // 提交表单
  async submitApply() {
    const {
      fillout,
      addForm
    } = this.data;
    if (fillout) {
      // console.log('发请求');
      addForm.phone += '';
      addForm.password += '';
      addForm.verifyPwd += '';
      addForm.openid = wx.$openid;
      wx.$api.organization.createOrganization(addForm).then(res => {
        wx.showToast({
          title: '提交成功',
        });
        wx.showModal({
          title: '提示',
          content: '您的注册申请已提交，请耐心等待平台管理员审核，审核结果将会下发到您注册填写的邮箱，请注意查收',
          success: res2 => {
            wx.switchTab({
              url: '/pages/index/index',
            });
          }
        })
      }).catch(err => {
        // delete addForm.openid;
        this.setData({
          fillout: true,
        });
      })
      // console.log(addForm);
      // 使用模板消息
      // wx.requestSubscribeMessage({
      //   tmplIds: [wx.$msg1({}).templateId, wx.$msg2({}).templateId],
      //   success: async res1 => {
      //     console.log('授权成功', res1)
      //     // 发送模板消息
      //     const sendData = {
      //       openid: wx.$openid,
      //       name: addForm.name,
      //       type: '申请入驻',
      //       remark: '您的入驻申请已提交，请耐心等待平台审核'
      //     }
      //     wx.$api.organization.createOrganization(addForm).then(res3 => {
      //       // console.log();
      //       wx.cloud.callFunction({
      //         name: "sendMsg",
      //         data: {
      //           openid: wx.$msg1(sendData).openid,
      //           templateId: wx.$msg1(sendData).templateId,
      //           data: wx.$msg1(sendData).data,
      //         }
      //       }).then(res2 => {
      //         console.log("推送消息成功", res2)
      //         wx.showToast({
      //           title: '提交成功',
      //         })
      //         wx.switchTab({
      //           url: '/pages/index/index',
      //         })
      //       }).catch(err2 => {
      //         console.log("推送消息失败", err2)
      //       })
      //     }).catch(err3 => {
      //       this.setData({
      //         fillout: true,
      //       })
      //     });

      //   },
      //   fail: async err1 => {
      //     // console.log('授权失败，不发送模板消息，只发送请求', err1)
      //     await wx.$api.organization.createOrganization(addForm);
      //     wx.showToast({
      //       title: '提交成功',
      //     })
      //     wx.switchTab({
      //       url: '/pages/index/index',
      //     })
      //   }
      // });
    } else {
      // console.log('不发请求');
      return;
    }



    // wx.cloud.callFunction({
    //   name: "sendMsg",
    //   data: {
    //     openid: wx.$openid
    //   }
    // }).then(res2 => {
    //   console.log("推送消息成功", res2)
    //   wx.showToast({
    //     title: '提交成功',
    //   })
    // }).catch(err2 => {
    //   console.log("推送消息失败", err2)
    // })
    if (fillout) {
      console.log('发请求');
      addForm.phone += '';
      addForm.password += '';
      addForm.verifyPwd += '';
      console.log(addForm);
      // await wx.$api.organization.createOrganization(addForm);
      // 提交成功之后返回首页，并发送模板消息给用户
    } else {
      console.log('不发请求');
      return;
    }
  },

  /* 
    示例数据：
    {
    "organizationName": "桂林电子科技大学",
    "type": 1,
    "description": null,
    "name": "梁宏溢",
    "phone": "157780323018",
    "email": "487535869@qq.com",
    "password": "11231"
}
  */

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