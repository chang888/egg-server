module.exports = {
  schedule: {
    type: 'redis',
  },
  async task(ctx, message) {
    console.log("task定时任务收到消息",message);
  }
}
