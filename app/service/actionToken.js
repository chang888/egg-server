const { Service } = require("egg")

class ActionTokenService extends Service {
  async apply(uid) {
    const { ctx } = this
    return ctx.app.jwt.sign(
      {
        data: {
          uid: uid
        },
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 7)
      },
      ctx.app.config.jwt.secret
    )
  }
}
module.exports = ActionTokenService
