const net = require('net')
const process = require('node:process')
const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const fs = require('fs')
const path = require('node:path')

rl.setPrompt('input> ')
rl.prompt()

const conn = net.createConnection({
  host: 'localhost',
  port: 3000
})

//https://stackoverflow.com/questions/8128578/reading-value-from-console-interactively
conn.on('connect', () => {
  console.log(`Connected to server!`)

  rl.on('line', function(line) {
    if (line === "quit" || line === "q") rl.close()
  
    console.log('requesting:', line)
    conn.write(JSON.stringify({
      fileName: line
    }))
  
    rl.prompt()
  }).on('close',function() {
    process.exit(0)
  })
})

conn.on('data', (data) => {
  
  const parsed = JSON.parse(data)
  if (parsed && parsed.fileName) {
    console.log('Server sent:', data.fileName)
    const fullPath = `.${path.sep}client${path.sep}${parsed.fileName}`

    fs.writeFile(fullPath, parsed.data, err => {
      if (err) {
        console.error(err)
      }
      console.log('File written to client folder successfully')
    })
  }
})

conn.setEncoding('UTF8')
