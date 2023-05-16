// pages/addRoom/addRoom.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    tempFilePaths: "https://img.zcool.cn/community/01820f5ba3444da8012099c81cb940.jpg@2o.jpg",
    addForm: {
      cover: null,
      code: null,
      name: null,
      address: null,
      contact: null,
      phone: null,
      number: null,
      desc: null,
    },
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    // 增加会议室
    if (options.type === "add") {
      this.setData({
        title: "新增会议室",
        type: options.type,
        disabled: false,
      });
    } else if (options.type === "edit") {
      const addForm = JSON.parse(JSON.stringify(wx.$currentRoomInfo));
      this.setData({
        title: "编辑会议室",
        type: options.type,
        disabled: false,
        addForm,
      });
    } else {
      console.log(wx.$currentRoomInfo);
      const addForm = JSON.parse(JSON.stringify(wx.$currentRoomInfo));
      this.setData({
        title: "会议室信息",
        type: options.type,
        disabled: true,
        addForm,
      });
    }
  },

  // 上传图片
  handleChooseImage(e) {
    const {
      type
    } = this.data;
    console.log(e);
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["original"],
      success: (chooseResult) => {
        console.log(chooseResult);
        let tempFilePath = chooseResult.tempFiles[0].tempFilePath;
        // let tempFilePaths = null;
        let timestamp = null;
        // 查看当前页面是要增加新页面还是更新
        // if (type === "add") {
        //   // tempFilePaths = chooseResult.tempFilePaths[0];
        //   // 使用时间戳作为图片的标识
        //   timestamp = new Date().getTime();
        // } else {
        //   // 更新图片
        //   let roomCoverImg = this.data.addForm.cover;
        //   timestamp = roomCoverImg.split("roomCoverImage/")[1].split(".")[0];
        // }
        // 每次上传都用新的时间戳
        timestamp = new Date().getTime();
        // 上传图片到云存储中
        this.uploadCoverImg(timestamp, tempFilePath);
      },
    });
  },

  // 上传图片
  uploadCoverImg(timestamp, tempFilePaths) {
    let {
      addForm
    } = this.data;
    console.log(timestamp, tempFilePaths);
    wx.showToast({
      title: "图片上传中",
      icon: "loading",
      mask: true,
      duration: 3000,
    });
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: "roomCoverImage/" + timestamp + ".png",
      // 指定要上传的文件的小程序临时文件路径
      filePath: tempFilePaths,
      // 成功回调
      success: (res1) => {
        console.log("上传成功", res1);
        // 获取图片的url
        if (res1.fileID) {
          console.log(res1.fileID);
          wx.cloud
            .getTempFileURL({
              fileList: [{
                fileID: res1.fileID,
              }, ],
            })
            .then((res3) => {
              wx.hideToast();
              wx.showToast({
                title: "图片上传成功",
                icon: "success",
              });
              // 清除微信小程序缓存
              console.log(res3.fileList);
              addForm.cover = res3.fileList[0].tempFileURL;
              Object.assign(wx.$currentRoomInfo, {
                cover: addForm.cover
              });
              // wx.$currentRoomInfo.cover = addForm.cover;
              this.setData({
                fileID: res1.fileID,
                addForm,
                // tempFilePaths,
              });
              // setTimeout(() => {
              //   this.setData({
              //     fileID: res1.fileID,
              //     roomCoverImg,
              //     tempFilePaths: roomCoverImg,
              //   })
              // }, 5000)
            })
            .catch((err) => {
              wx.hideToast();
              wx.showToast({
                title: "图片上传失败",
                icon: "error",
              });
              console.log(err);
            });
        }
      },
      fail: (err1) => {
        wx.hideToast();
        wx.showToast({
          title: "图片上传失败",
          icon: "error",
        });
        console.log(err1);
      },
    });
  },

  // 获取会议室的输入
  handleInput(e) {
    const {
      id
    } = e.target;
    let {
      value
    } = e.detail;
    this.setData({
      [`addForm.${id}`]: value,
    });
  },

  // 预览图片
  previewImg(e) {
    wx.previewImage({
      current: wx.$currentRoomInfo.cover,
      urls: [wx.$currentRoomInfo.cover],
    });
  },

  // 提交会议室信息
  handleSubmit() {
    const {
      addForm,
      type
    } = this.data;
    let count = 0;
    for (let key in addForm) {
      // console.log(key);

      switch (key) {
        case "cover": {
          addForm[key] !== null && addForm[key] !== "" && count++;
          break;
        }
        case "code": {
          addForm[key] !== null && addForm[key] !== "" && count++;
          break;
        }
        case "address": {
          addForm[key] !== null && addForm[key] !== "" && count++;
          break;
        }
        case "contact": {
          addForm[key] !== null && addForm[key] !== "" && count++;
          break;
        }
        case "phone": {
          addForm[key] !== null && addForm[key] !== "" && count++;
          break;
        }
        case "number": {
          addForm[key] !== null && addForm[key] !== "" && count++;
          break;
        }
        default: {
          break;
        }
      }
    }
    console.log(count);
    if (count !== 6) {
      wx.showModal({
        title: "提示",
        content: "请填写完整的会议室信息",
        success: (res) => {
          return;
        },
      });
      return;
    }

    if (type === "add") {
      const organization_id = wx.$userInfo.organization_id;
      Object.assign(addForm, {
        organization_id,
      });
      wx.$api.room.add(addForm).then((res) => {
        console.log(res);
        wx.navigateBack({
          delta: 1,
        });
        wx.showToast({
          title: res.data.message,
          mask: true,
        });
      });
    } else if (type === "edit") {
      wx.$api.room.update(addForm).then((res) => {
        console.log(res);
        wx.$currentRoomInfo = addForm;
        wx.navigateBack({
          delta: 1,
        });
        wx.showToast({
          title: res.data.message,
          mask: true,
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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