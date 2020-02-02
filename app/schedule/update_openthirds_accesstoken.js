/*            _
       __  __(_)___  ____ _____ ____
      / / / / / __ \/ __ `/ __ `/ _ \
     / /_/ / / /_/ / /_/ / /_/ /  __/
     \__, /_/ .___/\__,_/\__, /\___/
    /____/ /_/          /____/

*/

const Subscription = require("egg").Subscription

module.exports = {
  schedule: {
    interval: "110m", // 110 分钟间隔
    type: "worker" // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const openthirds = await ctx.model.Openthird.findAll()
    // console.log(openthirds)
    openthirds.forEach(async item => {
      await ctx.service.wechat.wechatOpenthird.setAccessToken(item.component_appid)
      // ctx.service.user.create({ mobile: 15057631272 })
    })
  }
}
