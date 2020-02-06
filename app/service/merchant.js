"use strict"

const { Service } = require("egg")

class MerchantService extends Service {
  /**
   * 创建用户
   * @param {*} payload
   */
  async creatMerchant() {
    let res = await ctx.model.Merchant.create({
      mname: "常常遇见在家测试"
    })
  }
}

module.exports = MerchantService
