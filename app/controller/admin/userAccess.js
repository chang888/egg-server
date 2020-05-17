// controller/userAccess.js
"use strict"
const { Controller } = require("egg")
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}
/**
 * @Controller 后台用户鉴权
 */
class UserAccessController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * @summary 用户登入
   * @description 用户登入
   * @router all /admin/auth/jwt/login
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async login() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(ctx.rule.loginRequest)
    // 组装参数
    const payload = ctx.request.body || {}

    // 调用 Service 进行业务处理
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, msg: "登录成功" })
  }
  /**
   * @summary 后台用户信息
   * @description 后台用户信息
   * @router get /admin/user/info
   * @request body loginRequest *body
   * @response 200 baseResponse 查询成功
   */
  async info() {
    const { ctx, service } = this
    // 校验参数
    // ctx.validate(ctx.rule.loginRequest)
    // 组装参数
    // const payload = ctx.request.body || {}

    // 调用 Service 进行业务处理
    // const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: users["admin-token"], msg: "登录成功" })
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
