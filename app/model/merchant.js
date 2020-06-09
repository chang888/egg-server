const moment = require("moment")

module.exports = app => {
  const { STRING, DATE, BIGINT, ENUM } = app.Sequelize

  const Merchant = app.model.define(
    "cc_merchants",
    {
      mid: {
        type: BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        comment: "商户id"
      },
      mname: {
        type: STRING(100),
        comment: "商户名称",
        allowNull: false
      },
      appid: {
        type: STRING(50),
        comment: "",
        unique: true
      },
      access_token: {
        type: STRING(255),
        comment: ""
      },
      refresh_token: {
        type: STRING(255),
        comment: ""
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
  return Merchant
}
