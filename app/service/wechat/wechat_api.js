"use strict"

const Service = require("egg").Service

class WechatApi extends Service {
  /**
   * 发送客服消息
  //  * @param {string} authorizerAccessToken 授权方access token
   * @param {string} openId 微信用户openId
   * @param {string} type 消息类型
   * @param {Object} content 消息主体
   */
  async send(openId, type, content) {
    let accessToken = await service.merchant.getAccessToken(mid)
    const { ctx, service, app } = this

    let url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`
    let body = {
      touser: openId,
      msgtype: type,
      [type]: content
    }
    // url += "?" + querystring.stringify(query)
    console.log(url, body, JSON.stringify(body), "send")

    let res = await app.curl(url, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify(body)
    })

    return res.data
  }

    /**
   * 生成带参数的微信二维码
   * @param {string} mid 商户id
   * @param {string} expire_seconds 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天），此字段如果不填，则默认有效期为30秒。
   * @param {string} action_name 	二维码类型，QR_SCENE为临时的整型参数值，QR_STR_SCENE为临时的字符串参数值，QR_LIMIT_SCENE为永久的整型参数值，QR_LIMIT_STR_SCENE为永久的字符串参数值
   * @param {string} action_info 		二维码详细信息
   * @param {string} scene_id 场景值ID，临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000）
   * @param {string} scene_str 场景值ID（字符串形式的ID），字符串类型，长度限制为1到64
   */

  async qrcodeCreate({mid, expire_seconds, action_name = "QR_SCENE", scene_id = 123, scene_str}) {
    const { ctx, service, app, } = this
    let accessToken = await service.merchant.getAccessToken(mid)
    
    let url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`
    let body = {
      expire_seconds,
      action_name,
      action_info: {scene: {scene_id, scene_str}},
    }
    // url += "?" + querystring.stringify(query)
    // console.log(url, body, JSON.stringify(body), "send")

    let res = await app.curl(url, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify(body)
    })
    console.log(res.data)
    

    return res.data
  }
}

module.exports = WechatApi
