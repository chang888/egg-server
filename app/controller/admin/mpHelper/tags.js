'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller 分组管理
 */
class TagsController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
    /**
   * @summary 微信标签列表
   * @description 微信获取标签列表
   * @Bearer []
   * @router get /admin/mp/tags/list
   * @response 200 baseResponse 模板列表
   */
  async getTagsList() {
    const { ctx, service } = this
    const { mid } = ctx.state.user.data
    // 校验参数
    // ctx.validate(ctx.rule.loginRequest)
    // 组装参数
    // const payload = ctx.request.body || {}

    // 调用 Service 进行业务处理
    const res = await service.wechat.wechatApi.tagsList({mid})
    console.log(res)
    res.unshift({id: -1, name: "所有粉丝"})
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: {list: res}, msg: "查询成功" })
  }
}

module.exports = TagsController;
