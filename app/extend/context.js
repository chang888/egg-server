// // extend/context.js
// const VALIDATOR = Symbol("Application#validator") // 定义一个全局唯一的属性
// var Parameter = require("parameter")

// module.exports = {
//   get validator() {
//     const that = this
//     if (!this[VALIDATOR]) {
//       this[VALIDATOR] = new Parameter({
//         translate() {
//           // 翻译成多语言
//           const arg = [...arguments]
//           return that.__(...arg)
//         }
//       })
//     }
//     return this[VALIDATOR]
//   },
//   validate(rules, data) {
//     data = data || this.request.body
//     const errors = this.validator.validate(rules, data)
//     console.log(errors)
//     return errors
//   }
// }
