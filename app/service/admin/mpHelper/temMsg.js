
'use strict';

const Service = require('egg').Service;

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
      dataType: "json"
    })
    // console.log(res)
    if (res.data.errcode){
      ctx.throw(408,res.data.errmsg)
    }
    // console.log(res.data, "data")
    return res.data
  }
  /**
    * 发送模板消息
    * @param {string} authorizerAccessToken 授权方access token
    * @param {string} openId 微信用户openId
    * @param {String} appId
    * @param {String} template_id
    * @param {String} url
    * @param {Object} data
    * @param {Object} miniprogram
  */

  async sendMsg(payload) {
    const { ctx, service, app } = this
    const { mid } = ctx.state.user.data
    const { appId, openid, template_id, url, data, miniprogram } = payload
    let merchant = await service.merchant.findByMid(mid)
    let obj = {
      touser: openid,
      template_id,
      url,
      data
  }
    miniprogram && (obj.miniprogram = miniprogram)
    // let res = await axios.post(`${this.prefix}message/template/send?access_token=${authorizerAccessToken}`, obj)
    // return res.data
    let apiUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${merchant.access_token}`
    let res = await app.curl(apiUrl, {
      method: "post",
      dataType: "json",
      data: JSON.stringify(obj)
    })
    // console.log(res)
    if (res.data.errcode){
      ctx.throw(408,res.data.errmsg)
    }
    console.log(res.data, "data")
    return res.data
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
    const { mid } = ctx.state.user.data
    let { send_data, title, template_id, send_object, send_time ,url, miniprogram, id  } = payload
    send_data = JSON.stringify(send_data)

    // 编辑的时候
    if (id) {

    }
    // 新建
    await ctx.model.Temmsg.create({send_data, title, template_id, send_object, send_time, mid, url, miniprogram})
  }

  /**
    * 删除模板消息
    * @param {string} id
  */

  async deleteMsg(id) {
    const { ctx, service, app } = this
    const { mid } = ctx.state.user.data
    // const { id  } = payload
    let delres = await ctx.model.Temmsg.destroy({where: {id, mid}})
    console.log(delres, "delres")
  }


    /**
    * 查询单个模板消息
    * @param {string} id
  */

  async getOneMsg(id) {
    const { ctx, service, app } = this
    const { mid } = ctx.state.user.data
    // const { id  } = payload
    let msg = await ctx.model.Temmsg.findOne({where: {id}})
    if (!msg) {
      ctx.throw(404, "未找到该模板消息")
    }
    if (msg.mid != mid) {
      ctx.throw(410, "商户不匹配")
    }
    return msg
    // console.log(msg, "delres")
  }


}

module.exports = TemMsgService;
