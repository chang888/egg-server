"use strict"

const Service = require("egg").Service
let moment = require("moment")
class TemMsgService extends Service {
  /**
   * 获取模板列表
   * @param {string} mid 商户id
   */

  async getTemplateList(mid) {
    const { ctx, service, app } = this
    let access_token = await service.merchant.getAccessToken(mid)

    let url = `https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=${access_token}`
    let res = await app.curl(url, {
      method: "get",
      dataType: "json",
    })
    // console.log(res)
    if (res.data.errcode) {
      ctx.throw(408, res.data.errmsg)
    }
    // console.log(res.data, "data")
    return res.data
  }
  /**
   * 发送模板消息
   * @param {string} mid 授权方access token
   * @param {string} openId 微信用户openId
   * @param {String} appId
   * @param {String} template_id
   * @param {String} url
   * @param {Object} data
   * @param {Object} miniprogram
   */

  async sendMsg({ mid, openid, template_id, url, send_data, miniprogram }) {
    const { ctx, service, app } = this
    let data = JSON.parse(send_data)
    // const { appId, openid, template_id, url, data, miniprogram } = payload
    let merchant = await service.merchant.findByMid(mid)
    let obj = {
      touser: openid,
      template_id,
      url,
      miniprogram,
      data,
    }

    let apiUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${merchant.access_token}`
    let res = await app.curl(apiUrl, {
      method: "post",
      dataType: "json",
      data: JSON.stringify(obj),
    })
    // console.log(res)
    if (res.data.errcode) {
      ctx.throw(408, res.data.errmsg)
    }
    console.log(res.data, "data")
    return res.data
  }

  /**
   * 启动发送模板消息任务
   * @param {Object} id
   */
  async startMsgTask(id) {
    const { ctx, service, app, agent } = this

    let tplMsg = await this.getOneMsg(id)
    if (moment(tplMsg.send_time).isBefore(moment())) {
      console.log("在当前时间之前 直接发送")
      console.log(msg.status)
      if (msg.status == 0) {
        if (msg.send_object == -1) {
          console.log(msg.send_object, "msg.send_object")
        } else {
          let openIds = []
          let rs = await service.wechat.wechatApi.tagUsers({ mid: msg.mid, tagid: msg.send_object })
          console.log(rs, "标签下的用户")
          if (rs.count > 10000) {
          } else {
            openIds = rs.data.openid
            openIds.forEach(async (item) => {
              console.log({ openid: item, ...msg.dataValues }, "参数")
              await this.sendMsg({ openid: item, ...msg.dataValues })
            })
          }
        }
        await msg.update({ status: "1" })
        console.log("状态正常执行发送")
      } else {
        ctx.throw(500, `推送主题：${msg.title} 发送失败`)
      }
    } else {
      await app.redis.get('client1').set(`quene11111`, "token", "EX", 30)


      // console.log( app.bull.empty())
      //  console.log( await app.bull.getJob(160).retry())
      // app.bull.process((job) => {
      //   console.log("消费者",job.data, job1, "app.bull.process"); // 'this is a job'
      // // });
      // console.log(agent, "agent.bull")
      // app.bull.add("jobname", {msgid: id}, {jobId: id});
      // (async () => {
      //   // you can access to connection and channel using app.rabbitmq.
      //   const { ch, conn } = app.rabbitmq;
      //   // assertQueue
      //   await ch.assertQueue(queueName, { durable: true });
      //   // checkQueue
      //   await ch.checkQueue(queueName);
      //   // sendToQueue
      //   ch.sendToQueue(queueName, Buffer.from(msg));
      //   // If you want to get a channel which uses "confirmation mode"
      //   const confirmChannel = await conn.createConfirmChannel();
      // }).catch(console.error);
      ctx.throw(500, `暂时不支持定时任务`)
      console.log("暂时不支持定时任务")
    }
  }

  /**
   * 保存/编辑模板消息
   * @param {Object} id
   * @param {String} title
   * @param {Object} send_time
   * @param {Object} send_object
   * @param {string} send_data 发送的数据
   * @param {String} template_id
   * @param {String} url
   * @param {Object} miniprogram
   */

  async saveOrEditMsg(payload) {
    const { ctx, service, app } = this
    let { mid, send_data, title, template_id, send_object, send_time, url, miniprogram, id } = payload

    if (id) {
      let temMsg = await this.getOneMsg(id)
      if (temMsg.mid != mid) {
        ctx.throw(409, "商户和模板消息不匹配")
      }
      // 更新
      await temMsg.update({ send_data, title, template_id, send_object, send_time, mid, url, miniprogram })
    } else {
      // 新建
      await ctx.model.Temmsg.create({ send_data, title, template_id, send_object, send_time, mid, url, miniprogram })
    }
  }

  /**
   * 删除模板消息
   * @param {string} id
   * @param {string} mid
   */

  async deleteMsg(id) {
    const { ctx, service, app } = this
    const { mid } = ctx.state.user.data
    // const { id  } = payload
    let delres = await ctx.model.Temmsg.destroy({ where: { id, mid } })
    console.log(delres, "delres")
  }

  /**
   * 查询单个模板消息
   * @param {string} id
   */

  async getOneMsg(id) {
    const { ctx, service, app } = this
    // const { id  } = payload
    let msg = await ctx.model.Temmsg.findOne({ where: { id } })
    if (!msg) {
      ctx.throw(404, "未找到该模板消息")
    }
    return msg
    // console.log(msg, "delres")
  }
}

module.exports = TemMsgService
