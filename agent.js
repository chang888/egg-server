module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    agent.redis.subscribe('task');
  });

  class RedisStrategy extends agent.ScheduleStrategy {
    start() {
      // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
      agent.redis.on('message', (channel, message) => {
        if (channel === 'task') {
          this.sendOne(message);
        }
      });
    }
  }
  agent.schedule.use('redis', RedisStrategy);
};