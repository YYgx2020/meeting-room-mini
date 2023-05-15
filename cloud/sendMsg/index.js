// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    /* 
      消息模板分类：
      获取openid，模板id，内容data
    */
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, // 要推送给哪个用户
      page: 'pages/index/index', // 要跳转到哪个小程序页面
      data: event.data,
      templateId: event.templateId, //模板id
    })
    console.log(result)
    /* 
      这里不要直接返回 result，否则会报 TypeError: Do not know how to serialize a BigInt 的错误，
      参考连接：
      https://developers.weixin.qq.com/community/develop/doc/0002e2b137c8580a30ad1297b5bc00?highLine=-504002
    */
    return result.errCode;
  } catch (err) {
    console.log(err)
    return err
  }
}