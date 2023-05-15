/* 
  封装微信官方的请求方法
*/

// 请求地址
import baseURL from '../utils/config';

const request = ({
  url,
  method,
  data
}) => {
  return new Promise((resolve, reject) => {
    // 查看请求地址
    // 不需要进行 token 验证的地址：
    const urlArr = [
      '/api/organization/create',
      '/api/user/login',
      '/api/user/register'
    ];
    let authorization = null;
    if (!urlArr.includes(url)) {
      authorization = 'bearer ' + wx.$token;
    }
    // 实际发请求的地方
    wx.request({
      url: baseURL + url,
      method,
      data,
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': authorization
      },
      success: res => {
        wx.hideLoading();
        // console.log(res.statusCode);
        if (res.data.code !== 200) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
          reject(res);
        } else {
          if (res.data.result != undefined) {
            if (res.data.message) {
              // console.log('打印信息');
              // wx.showToast({
              //   title: res.data.message,
              //   icon: 'success',
              //   mask: true
              // })
            }
          }
        }
        resolve(res);
      },
      fail: err => {
        wx.hideLoading();
        reject(err);
      }
    })
  })
}

export default request;