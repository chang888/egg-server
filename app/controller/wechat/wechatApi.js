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
    const { appid, appsecret } = app.config.wxConfig.gzhtest
    const oauth = new OAuth(appid, appsecret)
    const state = ctx.query.id
    console.log("ctx..." + ctx.query)
    let redirectUrl = ctx.query.callbackUrl
    redirectUrl = redirectUrl.replace("/wx/authorize", "/wx/callback")
    console.log(redirectUrl, "redirectUrl")

    const scope = "snsapi_userinfo"
    const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
    console.log("url=======" + url)
    // ctx.body = url
    ctx.redirect(url)
  }
  /**
   * @summary 微信用户回调方法
   * @description 用户回调方法
   * @router get /wx/callback
   * @response 200 baseResponse 登录成功
   */
  async callback() {
    const { ctx, app } = this
    const { appid, appsecret } = app.config.wxConfig.gzhtest
    const oauth = new OAuth(appid, appsecret)
    const code = ctx.query.code
    console.log("wxCallback code", code)
    const token = await oauth.getAccessToken(code)
    const accessToken = token.data.access_token
    const openid = token.data.openid
    console.log("accessToken", accessToken)
    console.log("openid", openid)
    ctx.redirect("/?openid=" + openid)
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
    ct.helper.success({ ctx, res, msg: "登录成功" })
  }
}
module.exports = WechatApiController
// }
