let moment = require("moment")
module.exports = {
  schedule: {
    // interval: '10s', // 1 分钟间隔
    cron: '59 55 16 21 6 *',
    type: 'all', // 指定所有的 worker 都需要执行
    // immediate: true,
    cronOptions: {
     tz: 'Asia/Shanghai'
    }
  },
  async task(ctx) {
    // const res = await ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });
    // ctx.app.cache = res.data;
    console.log(process.env.NODE_ENV,"执行定时任务", moment(new Date()).format("YYYY-MM-DD hh:mm:ss"))
  },
};