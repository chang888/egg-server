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
    const res = await service.admin.mpHelper.temMsg.getTemplateList(mid)
    // 删除订阅模板消息
    let index = res.template_list.findIndex(item => item.title == "订阅模板消息")
    res.template_list.splice(index, 1)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: {list: res.template_list}, msg: "查询成功" })
  }

  /**
   * @summary 发送模板消息
   * @description 微信发送模板消息
   * @router post /admin/mp/temMsg/send
   * @request header string *Authorization
   * @request body templateSendMsgRequest *body
   * @response 0 baseResponse 发送成功
   */
  async send() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templateSendMsgRequest)
    // 组装参数
    const { id } = ctx.request.body || {}

    // 调用 Service 进行业务处理
    const res = await service.admin.mpHelper.temMsg.startMsgTask(id)
    console.log(res, "sendMsgres")
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: "成功" })
  }

   /**
   * @summary 预览模板消息
   * @description 生成微信场景id二维码
   * @router post /admin/mp/temMsg/preview
   * @request header string *Authorization
   * @request body templatePreviewMsgRequest *body
   * @response 0 baseResponse 生成成功
   */

  async preview() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templatePreviewMsgRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.wechat.wechatApi.qrcodeCreate({mid, action_name:"QR_STR_SCENE", expire_seconds: 600, scene_str: `temMsg-${payload.id}` })
    console.log(res, "sendMsgres")
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res, msg: res.errmsg })
  }


  /**
   * @summary 保存模板消息
   * @description 保存模板消息
   * @router post /admin/mp/temMsg/saveOrEdit
   * @request header string *Authorization
   * @request body templateSaveOrEditMsgRequest *body
   * @response 0 baseResponse 保存成功
   */
  async saveOrEdit() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templateSaveOrEditMsgRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    payload.send_data = JSON.stringify(payload.send_data)

    payload.miniprogram = JSON.stringify(payload.miniprogram)
    // console.log(payload, "payload333")
    // // 调用 Service 进行业务处理
    await service.admin.mpHelper.temMsg.saveOrEditMsg({...payload, mid})
    // console.log(res, "sendMsgres")
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, msg: "保存成功"})
  }
    
  /**
   * @summary 获取模板消息byId
   * @description 获取模板消息byId
   * @router post /admin/mp/temMsg/getOne
   * @request header string *Authorization
   * @request body templateSendMsgRequest *body
   * @response 0 baseResponse 查询成功
   */
  async getOne() {
    const { ctx, service } = this
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templateSendMsgRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    const { id } = payload
    let res = await service.admin.mpHelper.temMsg.getOneMsg(id)
    ctx.helper.success({ ctx,res, msg: "查询成功"});
  }

  /**
   * @summary 删除模板消息
   * @description 删除模板消息
   * @router post /admin/mp/temMsg/delete
   * @request header string *Authorization
   * @request body templateDeleteMsgRequest *body
   * @response 0 baseResponse 删除成功
   */
  async delete() {
    const { ctx, service } = this
    console.log(ctx.request.body, "传入参数")
    // 校验参数
    ctx.validate(ctx.rule.templateDeleteMsgRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    const { id } = payload

    await service.admin.mpHelper.temMsg.deleteMsg(id)
    ctx.helper.success({ ctx, msg: "删除成功"});
  }

  /**
   * @summary 获取已保存模板消息列表
   * @description 获取已保存模板消息列表
   * @router post /admin/mp/temMsg/getMsgList
   * @request header string *Authorization
   * @request body templateSendMsgRequest *body
   * @response 0 baseResponse 保存成功
   */
  async getMsgList() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    let res = await ctx.helper.pager({ctx, modelName: "Temmsg",params: {where: {mid}}})
    ctx.helper.success({ ctx, res, msg: "查询成功"})
  }

}

module.exports = TemMsgController;
