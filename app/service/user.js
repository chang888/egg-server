const { Service } = require("egg")

class UserService extends Service {
  /**
   * 创建用户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx } = this
    // const { mobile = "", mid = 1, openid = "" } = payload

    // payload.password = await this.ctx.genHash(payload.password)
    return ctx.model.User.create(payload)
  }

  /**
   * 删除用户
   * @param {*} uid
   */
  async destroy(uid) {
    const { ctx } = this
    const user = await ctx.service.user.find(uid)
    if (!user) {
      ctx.throw(404, "用户不存在")
    }
    return ctx.model.User.findByIdAndRemove(uid)
  }

  /**
   * 修改用户
   * @param {*} uid
   * @param {*} payload
   */
  async update(uid, payload) {
    const { ctx, service } = this
    const user = await ctx.service.user.find(uid)
    if (!user) {
      ctx.throw(404, "user not found")
    }
    return ctx.model.User.findByIdAndUpdate(uid, payload)
  }

  /**
   * 查看单个用户
   */
  async show(uid) {
    const user = await this.ctx.service.user.find(uid)
    if (!user) {
      this.ctx.throw(404, "用户不存在")
    }
    return this.ctx.model.User.findById(uid).populate("role")
  }

  /**
   * 查看用户列表
   * @param {*} payload
   */
  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload
    let res = []
    let count = 0
    let skip = (Number(currentPage) - 1) * Number(pageSize || 10)
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate("role")
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({})
          .populate("role")
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    } else {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate("role")
          .sort({ createdAt: -1 })
          .exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({})
          .populate("role")
          .sort({ createdAt: -1 })
          .exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    }
    // 整理数据源 -> Ant Design Pro
    let data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.key = i
      delete jsonObject.password
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

  /**
   * 删除多个用户
   * @param {*} payload
   */
  async removes(payload) {
    return this.ctx.model.User.remove({ uid: { $in: payload } })
  }

  /**
   * 根据手机号查找
   * @param {*} mobile
   */
  async findByMobile(mobile) {
    return this.ctx.model.User.findOne({ mobile: mobile })
  }

  /**
   * 查找用户
   * @param {*} id
   */
  async find(id) {
    return this.ctx.model.User.findById(id)
  }

  /**
   * 更新用户信息
   * @param {*} id
   * @param {*} values
   */
  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values)
  }
}

module.exports = UserService
