const moment = require("moment")

module.exports = app => {
  const { STRING, DATE, BIGINT, ENUM } = app.Sequelize

  const User = app.model.define(
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
        unique: true,
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
        type: STRING,
        defaultValue: 0,
        comment: "0/未设置 1男 2女"
      },
      country: {
        type: STRING(20),
        comment: "国籍"
      },
      province: {
        type: STRING(20),
        comment: "省份"
      },
      city: {
        type: STRING(20),
        comment: "城市"
      },
      headimgurl: {
        type: STRING(255),
        comment: "头像地址"
      },

      access_token: {
        type: STRING(255),
        comment: "令牌"
      },
      refresh_token: {
        type: STRING(255),
        comment: "刷新令牌"
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      getterMethods: {
        created_at() {
          return moment(this.getDataValue("created_at")).format('YYYY-MM-DD HH:mm:ss');
        },
        updated_at() {
          return moment(this.getDataValue("updated_at")).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }
  )
  return User
}
