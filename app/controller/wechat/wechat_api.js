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
    // console.log(app, "控制器默认app")
  }
  /**
   * @summary 微信授权登录
   * @description 微信授权登录
   * @router get /wx/authorize
   * @response 200 baseResponse 登录成功
   */
  async wxAuthorize() {
    const { ctx, app } = this
    const { appid, appsecret } = app.config.wxConfig.gzh
    const oauth = new OAuth(appid, appsecret)
    const state = ctx.query.id
    let redirectUrl = ctx.href
    let callbackUrl = ctx.query.callbackUrl
    redirectUrl = redirectUrl.replace("/wx/authorize", "/wx/callback")
    const scope = "snsapi_userinfo"
    const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
    ctx.redirect(url + "&callback" + callbackUrl)
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
