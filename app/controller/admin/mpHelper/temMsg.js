'use strict';

const {Controller} = require('egg');
/**
 * @Controller 模板消息
 */
class TemMsgController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * @summary 微信获取模板列表
   * @description 微信获取模板列表
   * @router post /admin/mp/temMsg/getTemplateList
   * @request header string *Authorization
   * @request body loginRequest *body
   * @response 200 baseResponse 模板列表
   */
  async getTemplateList() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    // 校验参数
    // ctx.validate(ctx.rule.loginRequest)
    // 组装参数
    // const payload = ctx.request.body || {}

    // 调用 Service 进行业务处理
    const res = await service.admin.mpHelper.temMsg.getList(mid)
    // 删除订阅模板消息
    let index = res.template_list.findIndex(item => item.title == "订阅模板消息")
    res.template_list.splice(index, 1)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: {list: res.template_list}, msg: "查询成功" })
  }

  /**
   * @summary 发送模板消息
   * @description 微信发送模板消息
   * @router post /admin/mp/temMsg/sendMsg
   * @request header string *Authorization
   * @request body templateSendMsgRequest *body
   * @response 0 baseResponse 发送成功
   */
  async sendMsg() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templateSendMsgRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    console.log(payload, "payload333")
    // 调用 Service 进行业务处理
    const res = await service.admin.mpHelper.temMsg.sendMsg(payload)
    console.log(res, "sendMsgres")
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: res.errmsg })
  }


  /**
   * @summary 保存模板消息
   * @description 保存模板消息
   * @router post /admin/mp/temMsg/saveOrEditMsg
   * @request header string *Authorization
   * @request body templateSendMsgRequest *body
   * @response 0 baseResponse 保存成功
   */
  async saveOrEditMsg() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templateSaveOrEditMsgRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    // console.log(payload, "payload333")
    // // 调用 Service 进行业务处理
    const res = await service.admin.mpHelper.temMsg.saveOrEditMsg(payload)
    // console.log(res, "sendMsgres")
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: "请求成功"})
  }

}

module.exports = TemMsgController;
