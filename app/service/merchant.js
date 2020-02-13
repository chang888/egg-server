"use strict"

const { Service } = require("egg")

class MerchantService extends Service {
  /**
   * 创建用户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx, service } = this
    return await ctx.model.Merchant.create(payload)
  }
  /**
   * 商户绑定微信公众号回调
   * @param {*} mid 商户id
   */
  async bindMpCallback(mid) {
    const { ctx, service } = this
    // return await ctx.model.Merchant.findOne({ where: { mid } })
    let merchant = await this.findByMid(mid)
    merchant.update({})
    // merchant.
  }
  /**
   * 查找by mname
   * @param {*} mname 商户名
   */
  async findByMname(mname) {
    const { ctx, service } = this
    return await ctx.model.Merchant.findOne({ where: { mname } })
  }
  /**
   * 查找by appid
   * @param {*} appid 商户appid
   */
  async findByAppid(appid) {
    const { ctx, service } = this
    return await ctx.model.Merchant.findOne({ where: { appid } })
  }
  /**
   * 查找by mid
   * @param {*} mid 商户id
   */
  async findByMid(mid) {
    const { ctx, service } = this
    return await ctx.model.Merchant.findOne({ where: { mid } })
  }

  /**
   * 设置accessToken
   * @param {*} component_appid 第三方平台appid
   * @param {*} component_access_token 第三方平台token
   * @param {*} authorizer_appid 授权方appid
   * @param {*} authorizer_refresh_token 授权方刷新令牌
   */
  async setAccessToken(authorizer_appid) {
    const { ctx, app } = this

    const { appid: component_appid } = app.config.wxConfig.openthird

    let component_access_token = await ctx.service.wechat.wechatOpenthird.getAccessToken(component_appid)

    let merchant = await this.findByAppid(authorizer_appid)

    let { refresh_token: authorizer_refresh_token } = merchant

    let rs = await app.curl(`https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${component_access_token}`, {
      method: "POST",
      dataType: "json",
      data: JSON.stringify({ component_appid, authorizer_appid, authorizer_refresh_token })
    })

    if (!rs.data.authorizer_access_token) {
      // 微信抛出的异常
      ctx.throw(408, `errcode: ${rs.data.errcode} ,errmsg: ${rs.data.errmsg}`)
    }

    const { authorizer_access_token: access_token, authorizer_refresh_token: refresh_token, expires_in } = rs.data
    // 设置redis里access_token
    await app.redis.set(`merchantappid_${authorizer_appid}_authorizer_access_token`, access_token, "EX", expires_in)

    // 更新mysql中的数据
    await merchant.update({ access_token, refresh_token })
    return access_token
  }
  /**
   * 获取accessToken
   * @param {*} component_appid 第三方平台appid
   * @param {*} component_access_token 第三方平台token
   * @param {*} authorizer_appid 授权方appid
   * @param {*} authorizer_refresh_token 授权方刷新令牌
   */
  async getAccessToken(authorizer_appid) {
    const { ctx, app } = this
    // 从redis读取 没有就设置
    let authorizer_access_token = await app.redis.get(`merchantappid_${authorizer_appid}_authorizer_access_token`)
    if (!authorizer_access_token) {
      authorizer_access_token = await this.setAccessToken(authorizer_appid)
    }
    return authorizer_access_token
  }
}

module.exports = MerchantService
