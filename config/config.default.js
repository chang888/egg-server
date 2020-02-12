/* eslint valid-jsdoc: "off" */

"use strict"

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})
  config.static = {
    // maxAge: 31536000,
    prefix: "/",
    dir: "app/public"
  }
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1561446865227_2139"

  // add your middleware config here
  config.middleware = ["errorHandler"]
  config.swaggerdoc = {
    dirScanner: "./app/controller",
    apiInfo: {
      title: "cc接口",
      description: "cc接口文档 for egg",
      version: "1.0.0"
    },
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    enableSecurity: false,
    // enableValidate: true,
    routerMap: true,
    enable: true
  }
  config.i18n = {
    // 默认语言，默认 "en_US"
    defaultLocale: "zh-CN",
    // URL 参数，默认 "locale"
    queryField: "locale",
    // Cookie 记录的 key, 默认："locale"
    cookieField: "locale",
    // Cookie 的 domain 配置，默认为空，代表当前域名有效
    cookieDomain: "",
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: "1y"
  }
  // config.mongoose = {
  //   url: "mongodb://127.0.0.1:27017/egg_x",
  //   options: {
  //     // useMongoClient: true,
  //     autoReconnect: true,
  //     reconnectTries: Number.MAX_VALUE,
  //     bufferMaxEntries: 0
  //   }
  // }
  // mysql
  config.sequelize = {
    dialect: "mysql", //db类型
    database: "cc", //数据库名
    host: "rm-bp1zj40556x53jaacdo.mysql.rds.aliyuncs.com", //主机
    port: "3306", //端口
    username: "chang",
    password: "Chang789",
    logging: true,
    timezone: "+08:00"
  }
  // redis
  config.redis = {
    client: {
      host: "r-bp1a18a0b7e13ea4pd.redis.rds.aliyuncs.com",
      port: 6379,
      password: "Chang789",
      db: "0"
    }
  }
  config.jwt = {
    secret: "Great4-M",
    enable: true, // default is false
    // match: [/^\/api/] // optional
    ignore: [
      "/test",
      "/wx/third",
      "/merchant/bindmpcallback",
      "/wechat/wechatInterface/wechat",
      "/api/v1/test/",
      "/public/",
      "/js",
      "/wx/authorize",
      "/wx/callback",
      "/auth/jwt/login",
      "/swagger-ui.html"
    ] // 哪些请求不需要认证
  }
  // add your user config here
  config.wxConfig = {
    gzh: {
      appid: "wxd96c29c25fcd4c28",
      appsecret: "982817c5b666d6440007b2d99c454603",
      token: "zhengjinbin",
      encodingAESKey: "45yhmc8slMFvxeJM8z7ThzeiBO62dUZKS1pbDNVhIHu"
    },
    openthird: {
      appid: "wx63b29481682ccfd8",
      appsecret: "b19e51c6b40cceef1514f59b0e2c96a5",
      token: "zjb",
      encodingAESKey: "45yhmc8slMFvxeJM8z7ThzeiBO62dUZKS1pbDNVhIHu"
    },
    gzhtest: {
      appid: "wx8e0d0b741d9b1e4a",
      appsecret: "36dbfe832e502ec6f586ecd2b7e874a6",
      token: "zhengjinbin"
    }
    // myAppName: 'egg',
  }

  return {
    ...config
  }
}
