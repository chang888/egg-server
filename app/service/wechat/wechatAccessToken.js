"use strict"

const { Service } = require("egg")

class WechatAccessTokenService extends Service {
  /**
   * 获取component_access_token
   * @param {*} payload
   */
  async gerAccessToken(id = 1) {
    const { ctx, app } = this
    const openThird = ctx.model.User.findOne({ where: { id } })
    console.log(openThird, "找到的openThird")

    if (!openThird) ctx.throw(404, "第三方平台未找到")
    let rs = await app.curl(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`, {
      method: "POST",
      data: openThird
    })
    console.log(rs)
  }
}

module.exports = WechatAccessTokenService
