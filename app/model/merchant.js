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
  return Merchant
}
