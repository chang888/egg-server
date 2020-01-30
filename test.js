// let wx = require("./app/controller/wechat/wechatApi")
let home = require("./app/controller/home")
let pwd = require("/Users/zhengjinbin/code/egg-server/app/controller/wechat/wechatApi.js")
// console.log(JSON.stringify(wx))
let app = {
  config: {
    wxConfig: {
      gzhtest: {
        appid: "wxd96c29c25fcd4c28",
        appsecret: "982817c5b666d6440007b2d99c454603",
        token: "zhengjinbin",
        encodingAESKey: "45yhmc8slMFvxeJM8z7ThzeiBO62dUZKS1pbDNVhIHu"
      }
    }
  }
}
console.log(home)

console.log(pwd(app))

console.log(typeof pwd == "function")
