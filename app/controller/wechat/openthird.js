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
    const { ctx, app, service } = this
    let { openthird } = app.config.wxConfig
    await wechat(openthird).middleware(async (message, ctx) => {
      console.log(message, "收到的消息2222 收到的消息")
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
        let openthird = await service.wechat.wechatOpenthird.findByAppid(message.AppId)
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
    const { ctx, app, service } = this
    let { appid } = ctx.params
    let { openthird } = app.config.wxConfig
    await wechat(openthird).middleware(async (message, ctx) => {
      console.log(message, "收到的消息")
      // 全网发布自动化测试的账号
      const AUTO_TEST_MP_APPID = "wx570bc396a51b8ff8" // 测试公众号APPID
      const AUTO_TEST_MP_NAME = "gh_3c884a361561" // 测试公众号名称
      // const AUTO_TEST_MP_NAME = "gh_cfba9c792863" // 自己公众号名称

      const AUTO_TEST_MINI_PROGRAM_APPID = "wxd101a85aa106f53e" // 测试小程序APPID
      const AUTO_TEST_MINI_PROGRAM_NAME = "gh_8dad206e9538" // 测试小程序名称

      const AUTO_TEST_TEXT_CONTENT = "TESTCOMPONENT_MSG_TYPE_TEXT"
      const AUTO_TEST_REPLY_TEXT = "TESTCOMPONENT_MSG_TYPE_TEXT_callback"
      // 全网发布测试
      let { Content = "", FromUserName, ToUserName } = message

      if ([AUTO_TEST_MP_NAME, AUTO_TEST_MINI_PROGRAM_NAME].includes(ToUserName)) {
        console.log("\n\n\n>>> 检测到全网发布测试 <<<\n\n\n")
        console.log("打印消息主体:")
        let strList = Content.split(":")
        console.log(strList)
        // 测试公众号处理用户消息
        if (Content === AUTO_TEST_TEXT_CONTENT) {
          console.log(`\n>>> 测试用例：被动回复消息；状态：已回复；回复内容：${AUTO_TEST_REPLY_TEXT} <<<\n`)
          return AUTO_TEST_REPLY_TEXT
        }
        // 测试公众号使用客服消息接口处理用户消息
        else if (strList[0] === "QUERY_AUTH_CODE") {
          // 使用授权码获取授权方信息
          // 授权码
          let auth_code = strList[1]
          const { appid: component_appid } = app.config.wxConfig.openthird
          let res = await service.wechat.wechatOpenthird.apiQueryAuth(component_appid, auth_code)
          console.log(res, "92")

          // let obj = { appid: res.authorizer_appid, access_token: res.authorizer_access_token, refresh_token: res.authorizer_refresh_token }
          // let { component_access_token } = componentMap[`${componentAppId}`]
          // let {
          //   authorization_info: { authorizer_access_token }
          // } = await Authorizer.getAccessToken(componentAppId, component_access_token, strList[1])
          let content = `${auth_code}_from_api`

          let ret = await service.wechat.wechatApi.send(res.authorizer_access_token, FromUserName, "text", { content })
          // let ret = await Authorizer.send(authorizer_access_token, FromUserName, "text", { content })
          console.log(`\n>>> 测试用例：主动发送客服消息；状态：已发送；响应结果：${JSON.stringify(ret)}；发送内容：${content} <<<\n`)
        }
      }
      // 授权变更通知推送
      const type = message.InfoType
      if (message.Content == "爱你") {
        return "我也爱你2222"
      }
    })(ctx)
  }

  /**
   * @summary 生成申请授权url
   * @description 生成申请授权url
   * @router post /wx/third/componentlogin
   * @request body string component_appid eg:1 第三方appid
   * @request body string redirect_uri eg:http://baidu.com 回调url
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
