const net = require("net")
const fs = require('fs')
const path = require('node:path')

const server = net.createServer()

server.listen(3000, () => {
  console.log("server: Server listening on port 3000!")
})

server.on("connection", (client) => {
  console.log("server: New client connected!")
  // client.write("Hello there!")

  client.setEncoding("utf8")

  client.on("data", (data) => {
    const parse = JSON.parse(data)
    console.log('server-parse:', parse)
    
    if (parse.fileName) {
      const fileName = parse.fileName
      const fullPath = `.${path.sep}server${path.sep}${fileName}`
      fs.readFile(fullPath, 'utf8', (err, data) => {
        if (err) {
          // client.write(`error finding ${fileName} for you :(`)
          console.log('server-info: error reading file')
          return
        }
        client.write(JSON.stringify({
          fileName: fileName,
          data: data
        }))
      })
    }
  })

  client.on("close", (hadError) => {
    console.log("server: Some client disconnected ")
  })
})
