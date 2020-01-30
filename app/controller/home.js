"use strict"

const { Controller } = require("egg")

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    console.log(ctx)

    if (ctx.request.url == "/") {
      console.log("是/", ctx.href + "index.html")

      ctx.redirect(ctx.href + "index.html")
    }
  }
}

module.exports = HomeController
