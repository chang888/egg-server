"use strict"

const { Service } = require("egg")

class MerchantService extends Service {
  /**
   * 创建用户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx, service } = this
    return await ctx.model.Merchant.create(payload)
  }
  /**
   * 商户绑定微信公众号
   * @param {*} mid 商户id
   */
  async bindMp(mid) {
    const { ctx, service } = this
    // return await ctx.model.Merchant.findOne({ where: { mid } })
    let merchant = await this.findByMid(mid)
    merchant.update({})
    // merchant.
  }
  /**
   * 查找by mname
   * @param {*} mname 商户名
   */
  async findByMname(mname) {
    const { ctx, service } = this
    return await ctx.model.Merchant.findOne({ where: { mname } })
  }
  /**
   * 查找by mid
   * @param {*} mid 商户id
   */
  async findByMid(mid) {
    const { ctx, service } = this
    return await ctx.model.Merchant.findOne({ where: { mid } })
  }
}

module.exports = MerchantService
