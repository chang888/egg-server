const moment = require("moment")
module.exports = app => {
  const { STRING, DATE, BIGINT, ENUM } = app.Sequelize

  const Temmsg = app.model.define(
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
        defaultValue: "all",
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
      status: {
        type: ENUM,
        values: ["0", "1", "2", "3"],
        defaultValue: "0",
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
          return moment(this.getDataValue("created_at")).format('YYYY-MM-DD HH:mm:ss');
        },
        updated_at() {
          return moment(this.getDataValue("updated_at")).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }
  )
  return Temmsg
}
