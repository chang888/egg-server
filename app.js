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
    // const assert = require("assert")

    // Worker is ready, can do some things
    // don't need to block the app boot.
    const ctx = await this.app.createAnonymousContext()

    const run = async ctx => {
      console.log("========Init Data=========")
      const { STRING, DATE, BIGINT, ENUM } = this.app.Sequelize

      console.log("销毁user表")
      await ctx.model.queryInterface.dropTable("cc_users")
      console.log("销毁user表成功")

      console.log("创建user表")
      try {
        await ctx.model.queryInterface.createTable(
          "cc_users",
          {
            uid: {
              type: BIGINT(20),
              primaryKey: true,
              autoIncrement: true,
              comment: "用户id"
            },
            mid: {
              type: BIGINT(20),
              default: 1,
              allowNull: false,
              comment: "所属商户"
            },
            mobile: {
              type: STRING(50),
              comment: "手机号"
            },
            openid: {
              type: STRING(50),
              comment: "微信公众平台用户标识"
            },
            unionid: {
              type: STRING(50),
              comment: "微信开放平台唯一用户标识"
            },
            nickname: {
              type: STRING(100),
              comment: "昵称"
            },
            sex: {
              type: ENUM,
              values: ["0", "1", "2"],
              defaultValue: "0",
              comment: "0/未设置 1男 2女"
            },
            state: {
              type: ENUM,
              values: ["0", "1"],
              defaultValue: "1",
              comment: "0/无效 1有效"
            },
            created_at: DATE,
            updated_at: DATE,
            deleted_at: DATE
          },
          {
            created_at: "create_time",
            updated_at: "update_time",
            deleted_at: "delete_time",
            paranoid: true,
            getterMethods: {
              createTime() {
                // @ts-ignore
                return new Date(this.getDataValue("create_time")).getTime()
              },
              updateTime() {
                // @ts-ignore
                return new Date(this.getDataValue("update_time")).getTime()
              }
            }
          }
        )
        console.log("建表users成功")
      } catch (err) {
        console.log("创建user表error", err)
        return
      }
      // await ctx.model.User.destroy()
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
      await ctx.model.queryInterface.dropTable("cc_openthirds")
      console.log("销毁Openthird表成功")
      console.log("创建Openthird表")
      try {
        await ctx.model.queryInterface.createTable(
          "cc_openthirds",
          {
            id: {
              type: BIGINT(20),
              primaryKey: true,
              autoIncrement: true,
              comment: "id"
            },
            name: {
              type: STRING(20),
              allowNull: false,
              comment: "服务商名字"
            },
            component_appid: {
              type: STRING(20),
              allowNull: false,
              unique: true,
              primaryKey: true,
              comment: "第三方appid"
            },
            component_appsecret: {
              type: STRING(50),
              allowNull: false,
              comment: "第三方appsecret"
            },
            component_verify_ticket: {
              type: STRING(50),
              comment: "验证票据,微信每10分钟发送一次,有效时间较长"
            },
            component_access_token: {
              type: STRING,
              comment: "调用凭据令牌,有效期2小时"
            },
            created_at: DATE,
            updated_at: DATE,
            deleted_at: DATE
          },
          {
            created_at: "create_time",
            updated_at: "update_time",
            deleted_at: "delete_time",
            paranoid: true,
            getterMethods: {
              createTime() {
                // @ts-ignore
                return new Date(this.getDataValue("create_time")).getTime()
              },
              updateTime() {
                // @ts-ignore
                return new Date(this.getDataValue("update_time")).getTime()
              }
            }
          }
        )
        console.log("建表Openthird成功")
      } catch (err) {
        console.log("创建Openthird表error", err)
        return
      }

      console.log("新建模拟数据Openthird")
      try {
        let res = await ctx.model.Openthird.create({
          component_appid: "wx63b29481682ccfd8",
          component_appsecret: "b19e51c6b40cceef1514f59b0e2c96a5",
          name: "常常服务商test"
        })
        console.log("新建模拟数据成功Openthird")
      } catch (err) {
        console.log("新建模拟数据Openthirderr", err)
      }
    }
    // run(ctx)
  }

  async serverDidReady() {}

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook
