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
  async setAccessToken(component_appid) {
    const { ctx, app } = this
    const openThird = await ctx.model.Openthird.findOne({ where: { component_appid } })
    if (!openThird) ctx.throw(404, "第三方平台未找到")
    const { component_appsecret, component_verify_ticket } = openThird
    console.log(component_verify_ticket, "票据")

    let rs = await app.curl(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify({ component_appid, component_appsecret, component_verify_ticket })
    })
    console.log(rs.data, "设置setAccessToken成功")

    const { component_access_token } = rs.data
    openThird.update({ component_access_token })
    return rs.data
  }
}

module.exports = WechatOpenthird
