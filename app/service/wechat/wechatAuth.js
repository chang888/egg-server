"use strict"

const { Service } = require("egg")

class WechatAuthService extends Service {
  async setToken() {
    const { ctx, app } = this
  }
}

module.exports = WechatAuthService
