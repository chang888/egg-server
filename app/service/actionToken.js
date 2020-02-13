const { Service } = require("egg")

class ActionTokenService extends Service {
  async apply(uid, mid) {
    const { ctx } = this
    return await ctx.app.jwt.sign(
      {
        data: {
          uid: uid,
          mid: mid
        },
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 7)
      },
      ctx.app.config.jwt.secret
    )
  }
}
module.exports = ActionTokenService
