/**
 *  全局定义
 * @param app
 */

class AppBootHook {
  constructor(app) {
    this.app = app
    app.root_path = __dirname
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
    const app = this.app
    const MIDDLEWARE_NAME_JWT = "jwt"
    const MIDDLEWARE_NAME_ERRORHANDLER = "errorHandler"

    const jwtIndex = app.config.appMiddleware.indexOf(MIDDLEWARE_NAME_JWT)
    const errIndex = app.config.appMiddleware.indexOf(MIDDLEWARE_NAME_ERRORHANDLER)
    // jwt 中间件后置在统一异常处理之后
    if (jwtIndex == 0) {
      console.log("jwt在第一位")
      app.config.appMiddleware.splice(errIndex + 1, 0, MIDDLEWARE_NAME_JWT)
      app.config.appMiddleware.splice(jwtIndex, 1)
      console.log(app.config.appMiddleware, "appMiddleware")
    }
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    const ctx = await this.app.createAnonymousContext()
    // await this.app.runSchedule("temMsg_send")
    // console.log(await ctx.service.wechat.WechatApi)
    // let res = await ctx.service.wechat.wechatApi.tagUsers({mid:1, tagid: 102})
    // console.log(res, "=================")
  }

  async serverDidReady() {}

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook
