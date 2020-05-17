"use strict"

const { Controller } = require("egg")
/**
 * @controller HOME
 */
class HomeController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * @summary 测试接口
   * @description 测试接口
   * @router get /test/login
   * @response 200 baseResponse ok
   */
  async index() {
    const { ctx } = this
    console.log(ctx)

    if (ctx.request.url == "/") {
      console.log("是/", ctx.href + "index.html")

      ctx.redirect(ctx.href + "index.html")
    }
  }
  /**
   * @summary 测试接口
   * @description 测试接口
   * @router get /api/test
   * @response 200 baseResponse ok
   */
  async test() {
    const { ctx, service } = this
    console.log(ctx.state.user.data)
    // let res = await service.wechat.wechatOpenthird.setTicket("wx63b29481682ccfd8", "ticket@@@2El3U85lh1RRhFsFq5KDZ7m3izcZaZM4L4zjLIzdyz-K7e54fcwuFf3BuWhg9mfnrlMheQCQSLRs7mpTJjW85A")
    // console.log(res, "存openthird")
    ctx.helper.fail({
      ctx,
      code: 404,
      msg: "更新ticket成功"
    })
  }
}

module.exports = HomeController
