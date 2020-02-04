"use strict"

const Controller = require("egg").Controller
const wechat = require("../../utils/openthird_wechat")
/**
 * @controller 微信发的第三方
 */
class OpenthirdController extends Controller {
  /**
   * @summary 第三方授权事件接收URL
   * @description 第三方授权事件接收URL
   * @router all /wx/third/authorize
   */
  async authorizeCallback() {
    const { ctx, app } = this
    let { openthird } = app.config.wxConfig
    await wechat(openthird).middleware(async (message, ctx) => {
      console.log(message, "收到的消息")
      // 授权变更通知推送
      const type = message.InfoType
      // 授权成功
      if (type == "authorized") {
        return "success"
      }
      // 更新授权
      if (type == "updateauthorized") {
        return "success"
      }
      // 取消授权
      if (type == "unauthorized") {
        return "success"
      }
      // 10分钟的票据推送
      if (type == "component_verify_ticket") {
        let openthird = await ctx.service.wechat.wechatOpenthird.findByAppid(message.AppId)
        await openthird.update({ component_verify_ticket: message.ComponentVerifyTicket })
        if (openthird.component_access_token === null) app.runSchedule("update_openthirds_accesstoken")
        return "success"
      }
      if (message.Content == "爱你") {
        return "我也爱你"
      }
    })(ctx)
  }

  /**
   * @summary 授权后消息与事件接收URL
   * @description 授权后消息与事件接收URL
   * @router all /wx/third/news/callback/:appid
   */
  async newsCallback() {
    const { ctx, app } = this
    let { appid } = ctx.params
    let { openthird } = app.config.wxConfig
    await wechat(openthird).middleware(async (message, ctx) => {
      console.log(message, "收到的消息")
      // 授权变更通知推送
      const type = message.InfoType
      if (message.Content == "爱你") {
        return "我也爱你"
      }
    })(ctx)
  }

  /**
   * @summary 生成申请授权url
   * @description 生成申请授权url
   * @router post /wx/third/componentlogin
   * @request body string component_appid eg:1 第三方appid
   * @request body string redirect_uri eg:1 回调url
   * @response 200 baseResponse http://....
   */
  async componentlogin() {
    const { ctx, app } = this
    const payload = ctx.request.body || {}
    let res = await ctx.service.wechat.wechatOpenthird.componentLogin(payload)
    ctx.helper.success({ ctx, res, msg: "生成url成功" })
  }
}

module.exports = OpenthirdController
