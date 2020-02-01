"use strict"

const { Service } = require("egg")

class WechatOpenthird extends Service {
  /**
   * 获取component_access_token
   * @param {*} payload
   */
  async setTicket(component_appid, component_verify_ticket) {
    const { ctx, app } = this
    let rs = await ctx.model.Openthird.findOne({
      where: {
        component_appid
      }
    })
    return rs.update({ component_verify_ticket })
  }
  /**
   * 设置component_access_token
   * @param {*} payload
   */
  async setAccessToken(id = 1) {
    const { ctx, app } = this
    const openThird = await ctx.model.User.findOne({ where: { id } })
    console.log(openThird, "找到的openThird")

    if (!openThird) ctx.throw(404, "第三方平台未找到")
    let rs = await app.curl(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`, {
      method: "POST",
      data: openThird
    })
    console.log(rs)
  }
}

module.exports = WechatOpenthird
