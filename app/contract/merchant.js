module.exports = {
  createMerchantRequest: {
    mname: { type: "string", description: "商户名", required: true, example: "北京中行" }
    // mobile: { required: true, type: "string", description: "手机号", message: "手机号不能为空" },
    //   { type: "string", description: "手机号", example: "18801731528", format: /^1[34578]\d{9}$/ }
    // password: { type: "string", required: true, description: "密码", example: "111111" },
    // nickname: { type: "string", required: true, description: "昵称", example: "Tom" }
  }
}
