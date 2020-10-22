"use strict"

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  swaggerdoc: {
    enable: true,
    package: "egg-swagger-doc-feat"
  },
  cors : {
    enable: true,
    package: 'egg-cors',
  },

  validate: {
    enable: true,
    package: "egg-validate"
  },
  // mongoose: {
  //   enable: true,
  //   package: "egg-mongoose"
  // },
  sequelize: {
    enable: true,
    package: "egg-sequelize"
  },
  //redis
  redis: {
    enable: true,
    package: "egg-redis"
  },
  bcrypt: {
    enable: true,
    package: "egg-bcrypt"
  },
  jwt: {
    enable: true,
    package: "egg-jwt"
  },
  // logrotator : {
  //   enable: true,
  //   package: 'egg-logrotator',
  // },
  bull: {  // 插件名称是 'bull'
    enable: true,
    package: 'egg-bull-queue', // 包名称是 'egg-bull-queue'
  },
  // rabbitmq: {
  //   enable: true,
  //   package: 'egg-amqplib-plus',
  // }
  // amqplib : {
  //   enable: true,
  //   package: 'egg-amqplib-tf',
  // }
  // rabbitmq: {
  //   enable: true,
  //   package: '@eggplugin/rabbitmq'
  // },
  amqplib: {
    enable: true,
    package: 'egg-amqplib',
  }
}
