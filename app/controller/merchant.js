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
    const payload = ctx.body
    console.log(payload)
  }
}

module.exports = MerchantController
