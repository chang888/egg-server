"use strict"

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, service } = app
  // console.log(controller.wechat.wechatInterface.wechat, "router")
  // router.get("/", controller.home.index)
  // 微信接口接入和消息回复
  router.all("/wechat/wechatInterface/wechat", controller.wechat.wechatInterface.wechat)
  // router.all("/wx/third/authorize", controller.wechat.wechatInterface.openthird)
  // router.all("/wx/third/test", controller.wechat.wechatInterface.test)
}
