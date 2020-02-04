"use strict"

const getRawBody = require("raw-body")
const xml2js = require("xml2js")
const crypto = require("crypto")
const ejs = require("ejs")
const WXBizMsgCrypt = require("wechat-crypto")

function getSignature(timestamp, nonce, token) {
  var shasum = crypto.createHash("sha1")
  var arr = [token, timestamp, nonce].sort()
  shasum.update(arr.join(""))

  return shasum.digest("hex")
}

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, function(err, obj) {
      if (err) {
        return reject(err)
      }

      resolve(obj)
    })
  })
}

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
function formatMessage(result) {
  var message = {}
  if (typeof result === "object") {
    for (var key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue
      }
      if (result[key].length === 1) {
        var val = result[key][0]
        if (typeof val === "object") {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || "").trim()
        }
      } else {
        message[key] = result[key].map(function(item) {
          return formatMessage(item)
        })
      }
    }
  }
  return message
}

/*!
 * 响应模版
 */
/* eslint-disable indent */
var tpl = [
  "<xml>",
  "<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>",
  "<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>",
  "<CreateTime><%=createTime%></CreateTime>",
  "<MsgType><![CDATA[<%=msgType%>]]></MsgType>",
  '<% if (msgType === "news") { %>',
  "<ArticleCount><%=content.length%></ArticleCount>",
  "<Articles>",
  "<% content.forEach(function(item){ %>",
  "<item>",
  "<Title><![CDATA[<%-item.title%>]]></Title>",
  "<Description><![CDATA[<%-item.description%>]]></Description>",
  "<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic || item.thumb_url %>]]></PicUrl>",
  "<Url><![CDATA[<%-item.url%>]]></Url>",
  "</item>",
  "<% }); %>",
  "</Articles>",
  '<% } else if (msgType === "music") { %>',
  "<Music>",
  "<Title><![CDATA[<%-content.title%>]]></Title>",
  "<Description><![CDATA[<%-content.description%>]]></Description>",
  "<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>",
  "<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>",
  "</Music>",
  '<% } else if (msgType === "voice") { %>',
  "<Voice>",
  "<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>",
  "</Voice>",
  '<% } else if (msgType === "image") { %>',
  "<Image>",
  "<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>",
  "</Image>",
  '<% } else if (msgType === "video") { %>',
  "<Video>",
  "<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>",
  "<Title><![CDATA[<%-content.title%>]]></Title>",
  "<Description><![CDATA[<%-content.description%>]]></Description>",
  "</Video>",
  '<% } else if (msgType === "transfer_customer_service") { %>',
  "<% if (content && content.kfAccount) { %>",
  "<TransInfo>",
  "<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>",
  "</TransInfo>",
  "<% } %>",
  "<% } else { %>",
  "<Content><![CDATA[<%-content%>]]></Content>",
  "<% } %>",
  "</xml>"
].join("")
/* eslint-enable indent */

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl)

var wrapTpl =
  "<xml>" +
  "<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>" +
  "<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>" +
  "<TimeStamp><%-timestamp%></TimeStamp>" +
  "<Nonce><![CDATA[<%-nonce%>]]></Nonce>" +
  "</xml>"

var encryptWrap = ejs.compile(wrapTpl)

function reply2CustomerService(fromUsername, toUsername, kfAccount) {
  var info = {}
  info.msgType = "transfer_customer_service"
  info.createTime = new Date().getTime()
  info.toUsername = toUsername
  info.fromUsername = fromUsername
  info.content = {}
  if (typeof kfAccount === "string") {
    info.content.kfAccount = kfAccount
  }
  return compiled(info)
}

/*!
 * 将内容回复给微信的封装方法
 */
function reply(content, fromUsername, toUsername) {
  var info = {}
  var type = "text"
  info.content = content || ""
  if (Array.isArray(content)) {
    type = "news"
  } else if (typeof content === "object") {
    if (content.hasOwnProperty("type")) {
      if (content.type === "customerService") {
        return reply2CustomerService(fromUsername, toUsername, content.kfAccount)
      }
      type = content.type
      info.content = content.content
    } else {
      type = "music"
    }
  }
  info.msgType = type
  info.createTime = new Date().getTime()
  info.toUsername = toUsername
  info.fromUsername = fromUsername
  return compiled(info)
}

class Wechat {
  constructor(config, isDebug) {
    this.isDebug = isDebug
    if (typeof config === "string") {
      this.token = config
    } else if (typeof config === "object" && config.token) {
      this.token = config.token
      this.appid = config.appid || ""
      this.encodingAESKey = config.encodingAESKey || ""
    } else {
      throw new TypeError("please check your config")
    }
  }

  middleware(handle) {
    if (this.encodingAESKey) {
      console.log(this.token, this.encodingAESKey, this.appid)
      this.cryptor = new WXBizMsgCrypt(this.token, this.encodingAESKey, this.appid)
    }
    // console.log("马上执行cryptor",this.cryptor);
    return async (ctx, next) => {
      console.log("收到请求ctx", ctx)
      const query = ctx.query
      console.log("请求参数", query)

      // 加密模式
      const encrypted = !!(query.encrypt_type && query.encrypt_type === "aes" && query.msg_signature)
      console.log(encrypted, "-====encrypted加密模式")
      const timestamp = query.timestamp
      const nonce = query.nonce
      const echostr = query.echostr
      const method = ctx.method

      const TOKEN = ctx.wx_token || this.token
      const CRYPTOR = ctx.wx_cryptor || this.cryptor

      if (method === "GET") {
        var valid = false
        if (encrypted) {
          var signature = query.msg_signature
          valid = signature === CRYPTOR.getSignature(timestamp, nonce, echostr)
          console.log("存在加密模式", valid)
        } else {
          // 校验
          valid = query.signature === getSignature(timestamp, nonce, TOKEN)
          console.log("不存在加密模式", valid)
        }

        if (!valid) {
          ctx.status = 401
          ctx.body = "Invalid signature"
        } else {
          if (encrypted) {
            var decrypted = CRYPTOR.decrypt(echostr)
            // TODO 检查appId的正确性
            ctx.body = decrypted.message
          } else {
            console.log("不存在加密模式输出body", echostr)
            ctx.body = echostr
          }
        }
      } else if (method === "POST") {
        console.log("进入post")

        if (!this.isDebug && !encrypted) {
          console.log("非deg和非加密")

          // 校验
          if (query.signature !== getSignature(timestamp, nonce, TOKEN)) {
            console.log("Invalid signature")

            ctx.status = 401
            ctx.body = "Invalid signature"
            return
          }
        }

        var xml
        if (ctx.request.body && typeof ctx.request.body === "string") {
          xml = ctx.request.body
          console.log(xml, "原始xml1")
        } else {
          // 取原始数据
          xml = await getRawBody(ctx.req, {
            length: ctx.request.length,
            limit: "1mb",
            encoding: ctx.request.charset || "utf-8"
          })
          console.log(xml, "原始xml2")
        }

        // 保存原始xml
        ctx.weixin_xml = xml
        // 解析xml
        var result = await parseXML(xml)
        console.log(result, "解析原始xml1")

        var formatted = formatMessage(result.xml)
        console.log(formatted, "formatted")

        if (!this.isDebug && encrypted) {
          var encryptMessage = formatted.Encrypt
          if (query.msg_signature !== CRYPTOR.getSignature(timestamp, nonce, encryptMessage)) {
            ctx.status = 401
            ctx.body = "Invalid signature"
            return
          }
          var decryptedXML = CRYPTOR.decrypt(encryptMessage)
          var messageWrapXml = decryptedXML.message
          if (messageWrapXml === "") {
            ctx.status = 401
            ctx.body = "Invalid signature"
            return
          }
          var decodedXML = await parseXML(messageWrapXml)
          formatted = formatMessage(decodedXML.xml)
          console.log("格式化过的XML", formatted)
        }

        // 业务逻辑处理
        // 注意不要在业务逻辑中操作 body、type
        const body = await handle(formatted, ctx)
        // 第三方平台 全网发布
        console.log(290, body, "回复的消息")
        /*
         * 假如服务器无法保证在五秒内处理并回复，可以直接回复空串。
         * 微信服务器不会对此作任何处理，并且不会发起重试。
         */
        if (!body) {
          console.log("回复空")
          ctx.body = ""
          ctx.status = 200
          return
        }
        if (body === "success") {
          console.log("回复success")
          ctx.body = "success"
          ctx.status = 200
          return
        }

        var replyMessageXml = reply(body, formatted.ToUserName, formatted.FromUserName)
        console.log("回复的xml", replyMessageXml)

        if (this.isDebug || !query.encrypt_type || query.encrypt_type === "raw") {
          // console.log(replyMessageXml, "replyMessageXml")
          ctx.body = replyMessageXml
        } else {
          var wrap = {}
          wrap.encrypt = CRYPTOR.encrypt(replyMessageXml)
          wrap.nonce = parseInt(Math.random() * 100000000000, 10)
          wrap.timestamp = new Date().getTime()
          wrap.signature = CRYPTOR.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt)
          console.log(encryptWrap(wrap), "encryptWrap(wrap)")

          ctx.body = encryptWrap(wrap)
        }

        ctx.type = "application/xml"
      } else {
        ctx.status = 501
        ctx.body = "Not Implemented"
      }
    }
  }
}

module.exports = function(config, isDebug) {
  return new Wechat(config, isDebug)
}