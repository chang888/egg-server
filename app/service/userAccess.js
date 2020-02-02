const { Service } = require("egg")
class UserAccessService extends Service {
  async login(payload) {
    // console.log("login参数", payload)

    const { ctx, service } = this
    const user = await service.user.findByMobile(payload.mobile)
    console.log("88888mobile" + payload.moblie)
    if (!user) {
      ctx.throw(404, "用户不存在")
    }
    // let verifyPsw = await ctx.compare(payload.password, user.password)
    // if (!verifyPsw) {
    //   ctx.throw(404, "用户名或者密码错误")
    // }
    // 生成Token令牌
    return { token: await service.actionToken.apply(user.uid) }
  }

  async wxLogin(user) {
    // console.log("login参数", payload)

    const { ctx, service } = this
    // let verifyPsw = await ctx.compare(payload.password, user.password)
    // if (!verifyPsw) {
    //   ctx.throw(404, "用户名或者密码错误")
    // }
    // 生成Token令牌
    return { token: await service.actionToken.apply(user.uid) }
  }
  async logout() {}

  async current() {
    const { ctx, service } = this
    // ctx.state.user 可以提取到JWT编码的data
    const uid = ctx.state.user.data.uid
    const user = await service.user.findOne({ where: uid })
    if (!user) {
      ctx.throw(404, "用户不存在")
    }
    return user
  }
}

module.exports = UserAccessService
