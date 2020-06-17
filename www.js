// 该文件提供一个最简单的服务器
const http = require('http')
const server = http.createServer();
const PORT = 3000
const serverHandle = require('./app')
server.on('request', serverHandle)
server.listen(PORT)