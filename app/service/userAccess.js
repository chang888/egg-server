const { Service } = require("egg")
class UserAccessService extends Service {
  async login(payload) {
    const { ctx, service } = this

    const { mobile } = payload
    let mid = 1
    const data = { mobile, mid }
    let user = await service.user.findByMobileAndMid(data)
    if (!user) {
      ctx.throw(404, "该手机号尚未注册")
    }
    console.log(data, "token")
    
    return { token: await service.actionToken.apply(user.uid, user.mid) }
  }

  async wxLogin(user) {
    // console.log("login参数", payload)

    const { ctx, service } = this
    // let verifyPsw = await ctx.compare(payload.password, user.password)
    // if (!verifyPsw) {
    //   ctx.throw(404, "用户名或者密码错误")
    // }
    // 生成Token令牌
    return { token: await service.actionToken.apply(user.uid, user.mid) }
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
