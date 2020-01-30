module.exports = app => {
  const { STRING, DATE, BIGINT, ENUM } = app.Sequelize

  const User = app.model.define(
    "cc_user",
    {
      uid: {
        type: BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        comment: "用户id"
      },
      mid: {
        type: BIGINT(20),
        defaultValue: 1,
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
  return User
}
