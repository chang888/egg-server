const { Service } = require("egg")

class UserService extends Service {
  /**
   * wx查找或创建用户
   * @param {*} payload
   * @param {*} appid 商户appid
   */
  async findOrCreate(payload, appid) {
    const { ctx, app } = this
    let { openid, access_token, refresh_token, expires_in, unionid } = payload
    let merchant = await ctx.service.merchant.findByAppid(appid)

    const mid = merchant.mid

    await app.redis.set(`wxUser_mid_${mid}_openid_${openid}_accessToken`, access_token, "EX", expires_in)
    let users = await ctx.model.User.findOrCreate({ where: { openid } })
    // 查找并更新
    let user = await users[0].update({ access_token, refresh_token, mid, unionid })
    return user
  }

  /**
   * 获取wx用户基本信息
   * @param {*} openid 用户openid
   */
  async getUserinfo(openid) {
    const { ctx, app, service } = this
    const { mid } = ctx.state.user.data
    let merchant = await service.merchant.findByMid(mid)
    const { appid } = merchant

    // 通过用户access_token 获取用户基本资料
    // const access_token = await this.getUserAccessToken(openid)
    // const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`

    // 通过公众号access_token 获取是否关注公众号和用户资料
    const access_token = await service.merchant.getAccessToken(appid)
    const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`

    let rs = await app.curl(url, {
      dataType: "json",
      data: JSON.stringify({ appid })
    })
    if (!rs.data.openid) {
      ctx.thorw(409, JSON.stringify(rs.data))
    }
    await this.updateUserinfo(rs.data)
    return rs.data
  }

  /**
   * wx用户更新用户资料
   * @param {*} payload 要更新的数据
   */
  async updateUserinfo(payload) {
    const { ctx, app, service } = this
    const { uid } = ctx.state.user.data
    const user = await this.findByUid(uid)
    user.update(payload)
  }

  /**
   * 设置wx用户AccessToken
   * @param {*} openid 用户openid
   */
  async setUserAccessToken(openid) {
    const { ctx, app, service } = this

    const user = await this.findByOpenid(openid)

    let { refresh_token, mid } = user

    let merchant = await service.merchant.findByMid(mid)
    const { appid } = merchant
    if (!refresh_token) {
      // refresh_token 不存在情况下 重新请求授权
    }
    const { appid: component_appid } = app.config.wxConfig.openthird
    const component_access_token = await service.wechat.wechatOpenthird.getAccessToken(component_appid)

    const url = `https://api.weixin.qq.com/sns/oauth2/component/refresh_token?appid=${appid}&grant_type=refresh_token&component_appid=${component_appid}&component_access_token=${component_access_token}&refresh_token=${refresh_token}`

    let rs = await app.curl(url, {
      dataType: "json"
    })
    let { access_token, expires_in } = rs.data
    if (!access_token) {
      ctx.throw(409, JSON.stringify(rs.data))
    }
    await app.redis.set(`wxUser_mid_${mid}_openid_${openid}_accessToken`, access_token, "EX", expires_in)
    await user.update({ access_token })
    return access_token
  }

  /**
   * 获取wx用户AccessToken
   * @param {*} payload
   * @param {*} openid 用户openid
   */
  async getUserAccessToken(openid) {
    const { ctx, app } = this
    const { mid } = ctx.state.user.data

    let access_token = await app.redis.get(`wxUser_mid_${mid}_openid_${openid}_accessToken`)

    if (!access_token) {
      access_token = await this.setUserAccessToken(openid)
    }
    return access_token
  }

  /**
   * 创建用户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx } = this
    // const { mobile = "", mid = 1, openid = "" } = payload
    // payload.password = await this.ctx.genHash(payload.password)
    return await ctx.model.User.create(payload)
  }

  /**
   * 查找用户by openid
   * @param {*} openid
   */
  async findByOpenid(openid) {
    const { ctx, service } = this
    const user = await ctx.model.User.findOne({ where: { openid } })
    if (!user) {
      ctx.throw(404, "该openid用户未注册")
    }
    return user
  }

  /**
   * 根据手机号查找
   * @param {*} mobile
   */
  async findByMobileAndMid({ mobile, mid }) {
    return this.ctx.model.User.findOne({ where: { mobile, mid } })
  }

  /**
   * 查找用户by uid
   * @param {*} id
   */
  async findByUid(uid) {
    return this.ctx.model.User.findOne({ where: { uid } })
  }
}

module.exports = UserService
