const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config()

mongoose.connect(
  process.env.MONGO_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log('DB connected!')
    }
  }
)

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const GameServer = require('./GameServer')
GameServer.init(io)

app.use('/public', express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/view/index.html')
})

server.listen(3000, () => {
  console.log('running...')
})
