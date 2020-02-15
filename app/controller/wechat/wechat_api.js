// controller/wechatApi.js
"use strict"
const { Controller } = require("egg")

/**
 * @Controller 微信API
 */
const OAuth = require("co-wechat-oauth")
// module.exports = app => {
// console.log("执行类wechatapi实例化")

class WechatApiController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * @summary 第三方平台wx授权登录
   * @description 微信授权登录
   * @router get /wx/openthird/authorize/{appid}
   * @response 200 baseResponse 登录成功
   */
  async wxOpenthirdAuthorize() {
    const { ctx, app } = this
    console.log(ctx)

    const { appid } = ctx.params
    const { appid: component_appid } = app.config.wxConfig.openthird
    let redirectUrl = ctx.href.split("/wx/openthird/authorize")[0]
    console.log(redirectUrl, "redirectUrl")
    let callbackUrl = ctx.query.callbackUrl
    redirectUrl = redirectUrl + "/wx/openthird/callback"
    console.log(redirectUrl, "redirectUrl2")

    const scope = "snsapi_userinfo"
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${callbackUrl}&component_appid=${component_appid}#wechat_redirect`
    // console.log(url)

    ctx.redirect(url + "&callback" + callbackUrl)
  }

  /**
   * @summary 第三方平台微信用户回调方法
   * @description 用户回调方法
   * @router get /wx/openthird/callback
   * @response 200 baseResponse 登录成功
   */
  async wxOpenthirdCallback() {
    const { ctx, app, service } = this
    // const { appid, appsecret } = app.config.wxConfig.gzh
    // const oauth = new OAuth(appid, appsecret)
    console.log(ctx.query)

    const { code, state, appid } = ctx.query
    const { appid: component_appid } = app.config.wxConfig.openthird
    const component_access_token = await ctx.service.wechat.wechatOpenthird.getAccessToken(component_appid)

    // let callbackUrl = ctx.query.callbackUrl
    // const tokenData = await oauth.getAccessToken(code)
    // 通过code换access_token
    const url = `https://api.weixin.qq.com/sns/oauth2/component/access_token?appid=${appid}&code=${code}&grant_type=authorization_code&component_appid=${component_appid}&component_access_token=${component_access_token}`
    let rs = await app.curl(url, {
      dataType: "json"
    })
    console.log(rs)
    // ctx.body = rs
    const { openid } = rs.data
    if (!openid) {
      ctx.throw(409, `errcode: ${rs.data.errcode},msg: ${rs.data.errmsg}`)
    }
    // 创建查找用户 返回的是数组
    const user = await service.user.findOrCreate(rs.data, appid)
    // const user = users[0]
    console.log(user, "73user", user.uid, user.mid)

    // 生成token
    const token = await service.actionToken.apply(user.uid, user.mid)
    // // 根据openid查找用户
    // let user = await ctx.model.User.findOne({ where: { openid } })
    // if (!user) {
    //   user = await service.user.create({ openid })
    // }
    // let token = await service.userAccess.wxLogin(user)
    ctx.redirect(`${state}?token=${token}&openid=${openid}`)
    // ctx.redirect(`${state}`)
  }

  /**
   * @summary 微信获取用户基本信息
   * @description 获取用户基本信息
   * @router post /wx/openthird/userinfo
   * @request body openthirdGetUserinfo *body
   * @response 200 baseResponse 登录成功
   */
  async getUserinfo() {
    const { ctx, app } = this
    ctx.validate(ctx.rule.openthirdGetUserinfo)
    const { openid } = ctx.request.body
    let userinfo = await this.ctx.service.user.getUserinfo(openid)
    console.log(userinfo, "98userinfo")
    ctx.helper.success({ ctx, res: userinfo })
    // const { appid, appsecret } = app.config.wxConfig.gzh
    // const oauth = new OAuth(appid, appsecret)
    // const state = ctx.query.id
    // let redirectUrl = ctx.href
    // let callbackUrl = ctx.query.callbackUrl
    // redirectUrl = redirectUrl.replace("/wx/authorize", "/wx/callback")
    // const scope = "snsapi_userinfo"
    // const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
    // ctx.redirect(url + "&callback" + callbackUrl)
  }

  /**
   * @summary 微信授权登录
   * @description 微信授权登录
   * @router get /wx/authorize
   * @response 200 baseResponse 登录成功
   */
  async wxAuthorize() {
    // const { ctx, app } = this
    // const { appid, appsecret } = app.config.wxConfig.gzh
    // const oauth = new OAuth(appid, appsecret)
    // const state = ctx.query.id
    // let redirectUrl = ctx.href
    // let callbackUrl = ctx.query.callbackUrl
    // redirectUrl = redirectUrl.replace("/wx/authorize", "/wx/callback")
    // const scope = "snsapi_userinfo"
    // const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
    // ctx.redirect(url + "&callback" + callbackUrl)
  }

  /**
   * @summary 微信用户回调方法
   * @description 用户回调方法
   * @router get /wx/callback
   * @response 200 baseResponse 登录成功
   */
  async callback() {
    const { ctx, app, service } = this
    const { appid, appsecret } = app.config.wxConfig.gzh
    const oauth = new OAuth(appid, appsecret)
    const code = ctx.query.code
    let callbackUrl = ctx.query.callbackUrl
    const tokenData = await oauth.getAccessToken(code)
    const openid = tokenData.data.openid
    // 根据openid查找用户
    let user = await ctx.model.User.findOne({ where: { openid } })
    if (!user) {
      user = await service.user.create({ openid })
    }
    let token = await service.userAccess.wxLogin(user)
    ctx.redirect(`${callbackUrl}?token=${token.token}}`)
  }
  /**
   * @summary 微信登录
   * @description 微信登录
   * @router post /wx/wx/login
   * @response 200 baseResponse 登录成功
   */
  async wxLogin() {
    const { ctx, service, controller } = this
    // 校验参数
    // ctx.validate(ctx.rule.wxLoginRequest)
    // 组装参数
    const payload = ctx.request.body || {}

    // 调用 Service 进行业务处理
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, msg: "登录成功" })
  }
}
module.exports = WechatApiController
