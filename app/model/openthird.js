module.exports = app => {
  const { STRING, DATE, BIGINT, ENUM } = app.Sequelize

  const Openthird = app.model.define(
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
        unique: true,
        allowNull: false,
        primaryKey: true,
        comment: "第三方appid"
      },
      component_appsecret: {
        type: STRING(50),
        allowNull: false,
        comment: "第三方appsecret"
      },
      component_verify_ticket: {
        type: STRING(255),
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
  return Openthird
}
