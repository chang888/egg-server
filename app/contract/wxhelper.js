module.exports = {
  templateSendMsgRequest: {
    openid: { type: "string", description: "openid", required: true, example: "ob1dPv0DSdECDT-0kfI4LLN6lFYI" },
    template_id: { type: "string", description: "template_id", required: true, example: "ACbtcCL7hJne8NLnb39A-gn1D5DMvDvy0yydVH5Wxzk"},
    data: {type: "object", description: "发送的数据", required: true}
  },
}
