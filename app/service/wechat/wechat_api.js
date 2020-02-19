"use strict"

const Service = require("egg").Service

class WechatApi extends Service {
  /**
   * 发送客服消息
   * @param {string} authorizerAccessToken 授权方access token
   * @param {string} openId 微信用户openId
   * @param {string} type 消息类型
   * @param {Object} content 消息主体
   */
  async send(authorizerAccessToken, openId, type, content) {
    const { ctx, service, app } = this

    let url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${authorizerAccessToken}`
    let body = {
      touser: openId,
      msgtype: type,
      [type]: content
    }
    // url += "?" + querystring.stringify(query)
    console.log(url, body, "send")

    let res = await app.curl(url, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify(body)
    })

    return res.data
  }
}

module.exports = WechatApi
