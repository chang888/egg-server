module.exports = app => {
  const { STRING, DATE, BIGINT, ENUM } = app.Sequelize

  const User = app.model.define(
    "cc_user",
    {
      id: {
        type: BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        comment: "id"
      },
      component_appid: {
        type: BIGINT(20),
        defaultValue: 1,
        allowNull: false,
        comment: "第三方appid"
      },
      component_appsecret: {
        type: STRING(50),
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
  return User
}
