module.exports = {
  templateSaveOrEditMsgRequest: {
    id: { type: "number", description: "id", required: false, example: "1"},
    template_id: { type: "string", description: "template_id", required: true, example: "ACbtcCL7hJne8NLnb39A-gn1D5DMvDvy0yydVH5Wxzk"},
    title: {type: "string", description: "定义的标题", required: true},
    send_data: {type: "object", description: "发送的数据", required: true},
    send_object: {type: "string", description: "群发对象", required: true},
    send_time: {type: "string", description: "发送时间", required: true},
    url: {type: "string",format:  /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i, description: "模板跳转链接", required: false},
    miniprogram: {type: "object", description: "跳小程序所需数据" ,required: false},
  },
  templateDeleteMsgRequest: {
    id: { type: "number", description: "id", required: true, example: 1},
  },
  templatePreviewMsgRequest: {
    id: { type: "number", description: "id", required: true, example: 1},
  },
  templateSendMsgRequest: {
    id: { type: "number", description: "id", required: true, example: 1},
  }
}
