/**
 *  全局定义
 * @param app
 */

class AppBootHook {
  constructor(app) {
    this.app = app
    app.root_path = __dirname
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
    const app = this.app
    const MIDDLEWARE_NAME_JWT = "jwt"
    const MIDDLEWARE_NAME_ERRORHANDLER = "errorHandler"

    const jwtIndex = app.config.appMiddleware.indexOf(MIDDLEWARE_NAME_JWT)
    const errIndex = app.config.appMiddleware.indexOf(MIDDLEWARE_NAME_ERRORHANDLER)
    // jwt 中间件后置在统一异常处理之后
    if (jwtIndex == 0) {
      console.log("jwt在第一位")
      app.config.appMiddleware.splice(errIndex + 1, 0, MIDDLEWARE_NAME_JWT)
      app.config.appMiddleware.splice(jwtIndex, 1)
      console.log(app.config.appMiddleware, "appMiddleware")
    }
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    const ctx = await this.app.createAnonymousContext()
    
    // let res = await ctx.service.user.setUserAccessToken("ob1dPv0DSdECDT-0kfI4LLN6lFYI")
    // let res = await ctx.service.merchant.getAccessToken("wxd96c29c25fcd4c28")
    // console.log(res, "merchanttoken")
    // let news = await ctx.service.wechat.wechatApi.send(res, "ob1dPv0DSdECDT-0kfI4LLN6lFYI", "text", { content: "谁还不是个傻子" })
    // console.log(news)

    // let rs = await ctx.service.wechat.wechatOpenthird.getAuthorizerInfo("wx63b29481682ccfd8", "wxd96c29c25fcd4c28")
    // let rs = await ctx.service.wechat.wechatOpenthird.setAccessToken("wx63b29481682ccfd8")
    // let rs = await ctx.service.wechat.wechatOpenthird.componentLogin({ component_appid: "wx63b29481682ccfd8", redirect_uri: "http://changtest.free.idcfengye.com/index.html" })
    // console.log(rs, "didready")

    const run = async ctx => {
      console.log("========Init Data=========")
      const { STRING, DATE, BIGINT, ENUM } = this.app.Sequelize
      // console.log("销毁user表")
      // await ctx.model.queryInterface.dropTable("cc_users")
      // console.log("销毁user表成功")

      // console.log("创建user表")
      // try {
      //   await ctx.model.queryInterface.createTable(
      //     "cc_users",
      //     {
      //       uid: {
      //         type: BIGINT(20),
      //         primaryKey: true,
      //         autoIncrement: true,
      //         comment: "用户id"
      //       },
      //       mid: {
      //         type: BIGINT(20),
      //         default: 1,
      //         allowNull: false,
      //         comment: "所属商户"
      //       },
      //       mobile: {
      //         type: STRING(50),
      //         comment: "手机号"
      //       },
      //       openid: {
      //         type: STRING(50),
      //         comment: "微信公众平台用户标识"
      //       },
      //       unionid: {
      //         type: STRING(50),
      //         comment: "微信开放平台唯一用户标识"
      //       },
      //       nickname: {
      //         type: STRING(100),
      //         comment: "昵称"
      //       },
      //       sex: {
      //         type: ENUM,
      //         values: ["0", "1", "2"],
      //         defaultValue: "0",
      //         comment: "0/未设置 1男 2女"
      //       },
      //       state: {
      //         type: ENUM,
      //         values: ["0", "1"],
      //         defaultValue: "1",
      //         comment: "0/无效 1有效"
      //       },
      //       created_at: DATE,
      //       updated_at: DATE,
      //       deleted_at: DATE
      //     },
      //     {
      //       created_at: "create_time",
      //       updated_at: "update_time",
      //       deleted_at: "delete_time",
      //       paranoid: true,
      //       getterMethods: {
      //         createTime() {
      //           // @ts-ignore
      //           return new Date(this.getDataValue("create_time")).getTime()
      //         },
      //         updateTime() {
      //           // @ts-ignore
      //           return new Date(this.getDataValue("update_time")).getTime()
      //         }
      //       }
      //     }
      //   )
      //   console.log("建表users成功")
      // } catch (err) {
      //   console.log("创建user表error", err)
      //   return
      // }
      // console.log("新建模拟数据")
      //   try {
      //     let res = await ctx.service.user.create({
      //       mobile: "15057631272",
      //       nickname: "常"
      //     })
      //     console.log("新建模拟数据成功")
      //   } catch (err) {
      //     console.log("新建模拟数据err", err)
      //   }
      // console.log("Openthird")
      // console.log("销毁Openthird表")
      // await ctx.model.queryInterface.dropTable("cc_openthirds")
      // console.log("销毁Openthird表成功")
      // console.log("创建Openthird表")
      // try {
      //   await ctx.model.queryInterface.createTable(
      //     "cc_openthirds",
      //     {
      //       id: {
      //         type: BIGINT(20),
      //         primaryKey: true,
      //         autoIncrement: true,
      //         comment: "id"
      //       },
      //       name: {
      //         type: STRING(20),
      //         allowNull: false,
      //         comment: "服务商名字"
      //       },
      //       component_appid: {
      //         type: STRING(20),
      //         allowNull: false,
      //         unique: true,
      //         primaryKey: true,
      //         comment: "第三方appid"
      //       },
      //       component_appsecret: {
      //         type: STRING(50),
      //         allowNull: false,
      //         comment: "第三方appsecret"
      //       },
      //       component_verify_ticket: {
      //         type: STRING(255),
      //         comment: "验证票据,微信每10分钟发送一次,有效时间较长"
      //       },
      //       component_access_token: {
      //         type: STRING,
      //         comment: "调用凭据令牌,有效期2小时"
      //       },
      //       created_at: DATE,
      //       updated_at: DATE,
      //       deleted_at: DATE
      //     },
      //     {
      //       created_at: "create_time",
      //       updated_at: "update_time",
      //       deleted_at: "delete_time",
      //       paranoid: true,
      //       getterMethods: {
      //         createTime() {
      //           // @ts-ignore
      //           return new Date(this.getDataValue("create_time")).getTime()
      //         },
      //         updateTime() {
      //           // @ts-ignore
      //           return new Date(this.getDataValue("update_time")).getTime()
      //         }
      //       }
      //     }
      //   )
      //   console.log("建表Openthird成功")
      // } catch (err) {
      //   console.log("创建Openthird表error", err)
      //   return
      // }

      // console.log("新建模拟数据Openthird")
      // try {
      //   let res = await ctx.model.Openthird.create({
      //     component_appid: "wx63b29481682ccfd8",
      //     component_appsecret: "b19e51c6b40cceef1514f59b0e2c96a5",
      //     name: "常常服务商test"
      //   })
      //   console.log("新建模拟数据成功Openthird")
      // } catch (err) {
      //   console.log("新建模拟数据Openthirderr", err)
      // }
      console.log("销毁merchant表")
      await ctx.model.queryInterface.dropTable("cc_temmsgs")
      console.log("销毁merchant表成功")
      console.log("创建merchant表")
      try {
        await ctx.model.queryInterface.createTable(
          "cc_temmsgs",
          {
            id: {
              type: BIGINT(20),
              primaryKey: true,
              autoIncrement: true,
              unique: true,
              comment: "消息id"
            },
            mid: {
              type: BIGINT(20),
              comment: "商户id",
            },
            title: {
              type: STRING(100),
              comment: "主题",
              allowNull: false
            },
            send_time: {
              type: STRING(100),
              comment: "推送时间",
              allowNull: false
            },
            send_num: {
              type: STRING(100),
              comment: "推送人数",
              defaultValue: 0,
              allowNull: false
            },
            send_object: {
              type: STRING(100),
              comment: "群发对象",
              defaultValue: 0,
              allowNull: false
            },
            send_data: {
              type: STRING(100),
              comment: "推送数据",
              defaultValue: 0,
              allowNull: false
            },
            template_id: {
              type: STRING(100),
              comment: "模板id",
              defaultValue: 0,
              allowNull: false
            },
            url: {
              type: STRING(100),
              comment: "模板跳转链接",
              allowNull: true
            },
            miniprogram: {
              type: STRING(100),
              comment: "跳小程序所需数据，不需跳小程序可不用传该数据",
              allowNull: true
            },
            state: {
              type: ENUM,
              values: ["0", "1", "2", "3"],
              defaultValue: "1",
              comment: "0/没发送 1/发送中 2/已发送 3/已暂停"
            },
            created_at: DATE,
            updated_at: DATE,
            deleted_at: DATE
          },
          {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            getterMethods: {
              created_at() {
                // @ts-ignore
                return moment(this.getDataValue("created_at")).format('YYYY-MM-DD HH:mm:ss');
              },
              updated_at() {
                // @ts-ignore
                return moment(this.getDataValue("updated_at")).format('YYYY-MM-DD HH:mm:ss');
              }
            }
          }
        )
      //   console.log("建表cc_merchant成功")
      } catch (err) {
        console.log("创建cc_merchant表error", err)
        return
      }
      console.log("新建模拟数据cc_merchant")
      let res = await ctx.model.Temmsg.create({
        mid: 1,
        title: "测试发送",
        send_time: "发送时间",
        send_object: "all",
        send_data: JSON.stringify({}),
        template_id: "sddsdsds"
      })
      // console.log("新建模拟数据成功cc_merchant", res)
    }
    // run(ctx)
  }

  async serverDidReady() {}

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook
