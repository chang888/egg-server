"use strict"

const { Service } = require("egg")

class WechatOpenthird extends Service {
  /**
   * 通过appid查找第三方平台
   * @param {*} component_appid 第三方appid
   */
  async findByAppid(component_appid) {
    const { ctx, app } = this
    const openthird = await ctx.model.Openthird.findOne({ where: { component_appid } })
    if (!openthird) ctx.throw(404, "第三方平台未找到")
    return openthird
  }
  /**
   * 获取component_access_token
   * @param {*} component_appid 第三方appid
   * @param {*} component_verify_ticket 第三方票据
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
   * @param {*} component_appid 第三方appid
   */
  async setAccessToken(component_appid) {
    const { ctx, app } = this
    const openthird = await ctx.model.Openthird.findOne({ where: { component_appid } })
    if (!openthird) ctx.throw(404, "第三方平台未找到")
    const { component_appsecret, component_verify_ticket } = openthird
    let rs = await app.curl(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify({ component_appid, component_appsecret, component_verify_ticket })
    })
    if (!rs.data.component_access_token) {
      // 微信抛出的异常
      ctx.throw(408, `errxode: ${rs.data.errcode} ,errmsg: ${rs.data.errmsg}`)
    }
    const { component_access_token } = rs.data
    openthird.update({ component_access_token })
    ctx.logger.info(`更新AccessToken 第三方平台appid ${component_appid} `)

    return rs.data
  }
  /**
   * 获取设置预授权码pre_auth_code
   * @param {*} component_appid 第三方appid
   */
  async setPreAuthCode(component_appid) {
    const { ctx, app } = this
    const openthird = await this.findByAppid(component_appid)
    const { component_access_token } = openthird
    // 获取预授权码
    const rs = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${component_access_token}`, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify({ component_appid })
    })
    if (!rs.data.pre_auth_code) {
      // 微信抛出的异常
      ctx.throw(408, `errxode: ${rs.data.errcode} ,errmsg: ${rs.data.errmsg}`)
    }
    await app.redis.set(`openthird${component_appid}PreAuthCode`, rs.data.pre_auth_code, "EX", 600)
    return rs.data
  }
  /**
   * 生成授权链接
   * @param {*} component_appid 第三方appid
   * @param {*} pre_auth_code 预授权码
   * @param {*} redirect_uri 回调URL
   */
  async componentLogin({ component_appid, redirect_uri, auth_type = 3 }) {
    const { ctx, app } = this
    let pre_auth_code = await app.redis.get(`openthird${component_appid}PreAuthCode`)
    if (!pre_auth_code) {
      pre_auth_code = await this.setPreAuthCode(component_appid).pre_auth_code
    }
    const url = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${component_appid}&pre_auth_code=${pre_auth_code}&redirect_uri=${redirect_uri}&auth_type=${auth_type}`
    return url
  }
  /**
   * 生成授权链接
   * @param {*} component_appid 第三方appid
   * @param {*} pre_auth_code 第三方授权
   * @param {*} redirect_uri 回调URL
   */
  async getAuthorizerInfo() {}
}

module.exports = WechatOpenthird
