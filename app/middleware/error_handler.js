// /middleware/error_handler.js
"use strict"
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.log(ctx, "全局异常")

      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit("error", err, this)
      const status = err.status || 500
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const msg = status === 500 && app.config.env === "prod" ? "服务器错误" : err.message
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        msg: ctx.gettext(msg)
      }
      // jwt 401处理
      if (ctx.path.includes("unauthorerror") && err instanceof app.jwt.UnauthorizedError) {
        // ctx.status = 200
        // ctx.body = "UnauthorizedError"
      }
      // 全局egg-validate未通过处理
      if (status === 422) {
        delete ctx.body.error
        // console.log(status, "校验未通过的filed", err.errors)
        // 未通过校验项
        const validateName = ctx.gettext(err.errors[0].field)
        // ctx.gettext egg-I18n插件加载
        let errmsg = err.errors[0].message
        // 不符合正则的提示不符合规则
        if (errmsg.startsWith("should match")) errmsg = "should match"
        ctx.body.msg = validateName + ctx.gettext(errmsg)
        // ctx.body.detail = err.errors
      }
      ctx.status = 200
    }
  }
}
