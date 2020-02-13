"use strict"

const Controller = require("egg").Controller
/**
 * @controller 商户
 */
class MerchantController extends Controller {
  /**
   * @summary 创建商户
   * @description 创建商户
   * @router post /merchant/create
   * @request header string *Authorization
   * @request body createMerchantRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx, service } = this
    ctx.throw({ code: 800, message: "任意code" })
    const payload = ctx.request.body || {}
    ctx.validate(ctx.rule.createMerchantRequest)
    const { mname } = payload
    let merchant = await ctx.service.merchant.findByMname(mname)
    if (merchant) {
      ctx.throw(409, "商户名已经存在")
    }
    merchant = await ctx.service.merchant.create(payload)
    if (merchant) {
      ctx.helper.success({ ctx, msg: "创建成功" })
    }
  }
  /**
   * @summary 商户绑定微信公众号
   * @description 商户绑定微信公众号
   * @router post /merchant/bindmp
   * @request header string *Authorization
   * @request body merchantBindMpRequest *body
   * @response 200 baseResponse 绑定成功
   */
  async bindMp() {
    const { ctx, service } = this
    ctx.validate(ctx.rule.merchantBindMpRequest)
    const payload = ctx.request.body || {}
    const { mid } = payload
    const component_appid = "wx63b29481682ccfd8"
    const redirect_uri = ctx.href.replace("/merchant/bindmp", `/merchant/bindmpcallback?mid=${mid}&component_appid=${component_appid}`)
    console.log(redirect_uri)
    let res = await ctx.service.wechat.wechatOpenthird.componentLogin({ component_appid, redirect_uri })
    ctx.helper.success({ ctx, res, msg: "生成url成功" })
  }
  /**
   * @summary 商户绑定微信公众号回调
   * @description 商户绑定微信公众号回调
   * @router get /merchant/bindmpcallback
   * @request header string *Authorization
   * @response 200 baseResponse 绑定成功
   */
  async bindMpCallback() {
    const { ctx, service, app } = this
    console.log(ctx.query)

    const { auth_code, mid } = ctx.query
    const component_appid = "wx63b29481682ccfd8"

    console.log("auth_code")
    // 使用授权码获取授权方信息
    let res = await ctx.service.wechat.wechatOpenthird.apiQueryAuth(component_appid, auth_code)
    // 查找商户
    let merchant = await ctx.service.merchant.findByMid(mid)
    console.log(merchant)
    if (!merchant) {
      ctx.throw(404, "商户不存在")
    }
    console.log({ appid: res.authorizer_appid, access_token: res.authorizer_access_token, refresh_token: res.authorizer_refresh_token })
    await app.redis.set(`merchant${mid}authorizer_access_token`, res.authorizer_access_token, "EX", res.expires_in)

    await merchant.update({ appid: res.authorizer_appid, access_token: res.authorizer_access_token, refresh_token: res.authorizer_refresh_token })
    // await merchant.save()

    ctx.helper.success({ ctx, res, msg: "生成url成功" })
  }
}

module.exports = MerchantController
