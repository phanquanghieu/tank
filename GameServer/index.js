const uuid = require('uuid')

let io
let roomsData = {}

exports.init = function (_io) {
  io = _io
  io.on('connection', (socket) => {
    socket.on('connection', onConnection)
    socket.on('createRoom', onCreateRoom)
    socket.on('joinRoom', onJoinRoom)
    socket.on('enterKey', onEnterKey)
  })
}

function onConnection(){
  // this.emit('loadRoom', {rooms})
}

function onCreateRoom() {
  if (roomsData.room1) return
  // let roomId = uuid.v4()
  let roomId = 'room1'
  this.join(roomId)
  this.roomId = roomId

  let intervalId = setInterval(() => handleLogic(roomId), 15)

  roomsData[roomId] = {
    roomId,
    intervalId,
    bullets: [],
    tanks: {
      [this.id]: {
        x: 200,
        y: 200,
        hp: 5,
        color: 'lime',
        gunDirection: 0,
      },
    },
    playerActions: {
      [this.id]: {
        up: false,
        down: false,
        left: false,
        right: false,
        fire: false,
        gunDirection: 0,
      },
    },
  }
}

function onJoinRoom({ roomId }) {
  if(!roomsData[roomId]) return
  roomsData[roomId].tanks[this.id] = {
    x: 200,
    y: 200,
    hp: 5,
    color: 'red',
    gunDirection: 0,
  }
  roomsData[roomId].playerActions[this.id] = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    gunDirection: 0,
  }
  this.join(roomId)
  this.roomId = roomId
}

function onEnterKey(playerAction) {
  if (roomsData[this.roomId])
    Object.assign(roomsData[this.roomId].playerActions[this.id], playerAction)
}


function handleLogic(roomId) {
  let tanks = roomsData[roomId].tanks
  let bullets = roomsData[roomId].bullets
  let playerActions = roomsData[roomId].playerActions
  Object.keys(playerActions).forEach((playerId) => {
    let tank = tanks[playerId]
    let playerAction = playerActions[playerId]

    if (playerAction.up && tank.y - TANK.tankSpeed >= 0 + TANK.bodySize / 2)
      tank.y -= TANK.tankSpeed
    if (playerAction.down && tank.y + TANK.tankSpeed <= GAME.height - TANK.bodySize / 2)
      tank.y += TANK.tankSpeed
    if (playerAction.left && tank.x - TANK.tankSpeed >= 0 + TANK.bodySize / 2)
      tank.x -= TANK.tankSpeed
    if (playerAction.right && tank.x + TANK.tankSpeed <= GAME.width - TANK.bodySize / 2)
      tank.x += TANK.tankSpeed

    let _gunDirection = Math.atan(
      -(tank.y - playerAction.mousePos?.y) / (tank.x - playerAction.mousePos?.x)
    )
    if (tank.x > playerAction.mousePos?.x) _gunDirection += Math.PI
    tank.gunDirection = _gunDirection

    if (playerAction.fire) {
      bullets.push({
        x: tank.x + Math.cos(_gunDirection) * TANK.gunLength,
        y: tank.y - Math.sin(_gunDirection) * TANK.gunLength,
        vx: Math.cos(_gunDirection) * TANK.bulletSpeed,
        vy: -Math.sin(_gunDirection) * TANK.bulletSpeed,
      })
    }
  })

  roomsData[roomId].bullets = bullets.filter((bullet) => {
    bullet.x += bullet.vx
    bullet.y += bullet.vy

    let result = isCollision(bullet, roomId)
    if (result) return false

    if (isInMap(bullet.x, bullet.y, 'bullet')) {
      return true
    }
    return false
  })

  io.in(roomId).emit('data', {
    tanks: roomsData[roomId].tanks,
    bullets: roomsData[roomId].bullets,
  })
}

const isCollision = (bullet, roomId) => {
  for (let [key, tank] of Object.entries(roomsData[roomId].tanks)) {
    if (isInArea(bullet.x, bullet.y, tank.x, tank.y, TANK.bodySize / 2)) {
      roomsData[roomId].tanks[key].hp -= 1
      if(roomsData[roomId].tanks[key].hp ===0){
        io.to(key).emit('lose')
        io.to(key).socketsLeave(roomId)
        delete roomsData[roomId].tanks[key]
        delete roomsData[roomId].playerActions[key]
      }
      return true
    }
  }
  return false
}

const isInMap = (x, y, obj) => {
  let r = (obj === 'tank' ? TANK.bodySize : TANK.bulletSize) / 2
  if (x >= 0 - r && x <= GAME.width + r && y >= 0 - r && y <= GAME.height + r) return true
  return false
}

const isInArea = (x1, y1, x2, y2, r) => {
  console.log(x1, y1, x2, y2, r)
  if (x1 >= x2 - r && x1 <= x2 + r && y1 >= y2 - r && y1 <= y2 + r) return true
  return false
}

const GAME = {
  width: 1000,
  height: 600,
}

const TANK = {
  tankSpeed: 2,
  bodySize: 30,
  gunLength: 30,
  bulletSpeed: 5,
  bulletSize: 6,
  bulletColor: 'blue',
}
