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
    const Merchants = await ctx.model.Merchant.findAll()
    // console.log(Merchants)
    Merchants.forEach(async item => {
      if (item.appid && item.refresh_token) {
         await ctx.service.merchant.setAccessToken(item.appid)
      }
    })
  }
}
