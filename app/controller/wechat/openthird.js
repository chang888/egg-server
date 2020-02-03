"use strict"

const Controller = require("egg").Controller
const wechat = require("../../utils/openthird_wechat")
/**
 * @controller 微信发的第三方
 */
class OpenthirdController extends Controller {
  /**
   * @summary 第三方消息与事件接收URL
   * @description 消息与事件接收URL
   * @router all /wx/third/news/callback/:appid
   */
  async newsCallback() {
    const { ctx, app } = this
    let { appid } = ctx.params
    console.log(appid, "所带参数")
    let { openthird } = app.config.wxConfig
    console.log(openthird)
    // openthird.appid = appid
    // console.log("新", openthird)

    let rs = await wechat(openthird).middleware(async (message, ctx) => {
      console.log(message, "收到的消息")
      if (message.Content == "爱你") return "我也爱你"
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
