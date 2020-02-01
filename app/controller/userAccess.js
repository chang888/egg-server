// controller/userAccess.js
"use strict"
const { Controller } = require("egg")
/**
 * @Controller 用户鉴权
 */
class UserAccessController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * @summary 用户登入
   * @description 用户登入
   * @router post /auth/jwt/login
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async login() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(ctx.rule.loginRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    const { mobile } = payload
    console.log(mobile, "传来的mobile")

    let user = await service.user.findByMobile(mobile)
    console.log(user, "YONGHU")

    if (!user) {
      ctx.throw(404, "该手机号尚未注册")
    }
    // 调用 Service 进行业务处理
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, msg: "登录成功" })
  }
  /**
   * @summary 用户登出
   * @description 用户登出
   * @router post /auth/jwt/logout
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async logout() {
    const { ctx, service } = this
    // 调用 Service 进行业务处理
    await service.userAccess.logout()
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }
}

module.exports = UserAccessController
