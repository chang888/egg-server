// controller/wechatInterface.js
"use strict"
const { Controller } = require("egg")
const wechat = require("co-wechat")
/**
 * @Controller 微信自动回复（文本、图片、语音、视频、音乐、图文）
 */
module.exports = app => {
  class WechatInterfaceController extends Controller {
    constructor(ctx) {
      super(ctx)
    }
    async reply() {}
  }
  WechatInterfaceController.prototype.wechat = wechat(app.config.wxConfig.gzhtest).middleware(async (message, ctx) => {
    // TODO
    console.log(`message: ${JSON.stringify(message)}`)
    return "发送了" + message.Content
  })
  WechatInterfaceController.prototype.openthird = wechat(app.config.wxConfig.openthird).middleware(async (message, ctx) => {
    // TODO

    console.log(`message: ${JSON.stringify(message)}`)
    if (message.InfoType == "component_verify_ticket") {
      console.log("进入校验ticket")
      return "success"
    }
    return "发送了" + message.Content
  })
  return WechatInterfaceController
}
