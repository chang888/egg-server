
'use strict';

const Service = require('egg').Service;

class TemMsgService extends Service {
  /**
   * 获取模板列表
   * @param {string} mid 商户id
   */

  async getList(mid) {
    const { ctx, service, app } = this
    let access_token = await service.merchant.getAccessToken(mid)
  
    // if (!merchant.access_token) {
    //   console.log(merchant.appid, "merchant.appid")
      
    //   await ctx.service.merchant.setAccessToken(merchant.appid)
    // }
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
    * 保存模板消息
    * @param {string} authorizerAccessToken 授权方access token
    * @param {string} openId 保存用户openId
    * @param {String} appId
    * @param {String} template_id
    * @param {String} url
    * @param {Object} data
    * @param {Object} miniprogram
  */

  async saveOrEditMsg(payload) {
    const { ctx, service, app } = this
    const { mid } = ctx.state.user.data
    let { send_data, title, template_id, send_object, send_time ,url, miniprogram  } = payload
    send_data = JSON.stringify(send_data)
    Object.assign(payload)
    console.log(url)
    
    let res = await ctx.model.Temmsg.create({send_data, title, template_id, send_object, send_time, mid, url, miniprogram})
    console.log(res, "Temmsg")
    
    return res
  }

}

module.exports = TemMsgService;
