// controller/wechatInterface.js
"use strict"
const { Controller } = require("egg")
// const wechat = require("co-wechat")
const wechat = require("../../utils/wechat")
/**
 * @Controller 微信自动回复（文本、图片、语音、视频、音乐、图文）
 */
module.exports = app => {
  // const {service} = app
  class WechatInterfaceController extends Controller {
    constructor(ctx) {
      super(ctx)
    }
    async reply() {}
  }

  WechatInterfaceController.prototype.wechat = wechat(app.config.wxConfig.gzh).middleware(async (message, ctx) => {
    // TODO
    console.log(`message: ${JSON.stringify(message)}`)
    // return "发送了" + message.Content
    return "success"
  })
  // WechatInterfaceController.prototype.openthird = wechat(app.config.wxConfig.openthird).middleware(async (message, ctx) => {
  //   console.log(`message: ${JSON.stringify(message)}`)
  //   if (message.InfoType == "component_verify_ticket") {
  //     let rs = await ctx.model.Openthird.findOne({
  //       where: {
  //         component_appid: message.AppId
  //       }
  //     })
  //     await rs.update({ component_verify_ticket: message.ComponentVerifyTicket })
  //     // ctx.service.wechat.
  //     if (rs.component_access_token === null) app.runSchedule("update_openthirds_accesstoken")
  //     return "success"

  //     // ctx.body = "success"
  //   }
  //   return "发送了" + message.Content
  // })
  WechatInterfaceController.prototype.openthird = wechat(app.config.wxConfig.openthird).middleware(async (message, ctx) => {
    console.log(`message: ${JSON.stringify(message)}`)
    if (message.InfoType == "component_verify_ticket") {
      let rs = await ctx.model.Openthird.findOne({
        where: {
          component_appid: message.AppId
        }
      })
      await rs.update({ component_verify_ticket: message.ComponentVerifyTicket })
      // ctx.service.wechat.
      if (rs.component_access_token === null) app.runSchedule("update_openthirds_accesstoken")
      return "success"

      // ctx.body = "success"
    }
    return "发送了" + message.Content
  })

  // WechatInterfaceController.prototype = res => {
  //   console.log(app)
  //   const { service } = res
  //   console.log(service, "======设置setticket", service.wechat.setTicket)
  // }
  return WechatInterfaceController
}
