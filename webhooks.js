const http = require("http")
const createHandler = require("github-webhook-handler")
const handler = createHandler({
  path: "/docker_deploy",
  secret: "myHashSecret"
})
const { spawn } = require("child_process")
function run_cmd(cmd, args, callback) {
  const child = spawn(cmd, args)
  let resp = ""
  child.stdout.on("data", function(buffer) {
    resp += buffer.toString()
  })
  child.stdout.on("end", function() {
    callback(resp)
  })
}

http
  .createServer((req, res) => {
    handler(req, res, err => {
      console.log("收到请求githooks")

      //   res.statusCode = 200
      res.statusCode = 404
      res.end("no such location")
    })
  })
  .listen(7777, () => {
    console.log("Webhook listen at 7777")
  })

handler.on("error", err => {
  console.error("Error", err.message)
})

handler.on("push", event => {
  console.log(event, "收到event")

  if (event.payload.ref === "refs/heads/master") {
    console.log("Receive master push ")
    console.log("收到修改的文件", event.payload.head_commit)
    console.log("===========", event.payload.head_commit.modified)
    console.log("===========", event.payload.head_commit.commiter)

    run_cmd("sh", ["./deploy-dev.sh"], function(text) {
      console.log(text)
    })
  }
})
