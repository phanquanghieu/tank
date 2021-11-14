const { login, register, updatePlayer } = require('./api')

let io
let roomsData = {
  room1: {
    roomId: 'room1',
    bullets: [],
    tanks: {},
    playerActions: {},
  },
  room2: {
    roomId: 'room2',
    bullets: [],
    tanks: {},
    playerActions: {},
  },
  room3: {
    roomId: 'room3',
    bullets: [],
    tanks: {},
    playerActions: {},
  },
  room4: {
    roomId: 'room4',
    bullets: [],
    tanks: {},
    playerActions: {},
  },
}

exports.init = function (_io) {
  io = _io
  io.on('connection', (socket) => {
    socket.on('register', onRegister)
    socket.on('login', onLogin)
    socket.on('joinRoom', onJoinRoom)
    socket.on('enterKey', onEnterKey)
  })
}

async function onRegister({ username, password }) {
  let res = await register(username, password)
  this.emit('resRegister', res)
}

async function onLogin({ username, password }) {
  let res = await login(username, password)
  if (res.e) return this.emit('resLogin', res)
  let roomsInfo = []

  Object.keys(roomsData).forEach((roomKey) => {
    roomsInfo.push({ id: roomKey, name: 'room' })
  })

  this.emit('resLogin', { ...res, roomsInfo })
}

function onJoinRoom({ roomId, player }) {
  if (!roomsData[roomId]) return
  let checkRoom = io.sockets.adapter.rooms.get(roomId)
  if (!checkRoom) createRoom(roomId)
  else if (checkRoom.size > 4) {
    return
  }
  roomsData[roomId].tanks[player._id] = {
    socketId: this.id,
    playerId: player._id,
    hp: player.hp,
    hpMax: player.hp,
    level: player.level,
    atk: player.atk,
    x: Math.floor(Math.random() * (GAME.width - 100) + 50),
    y: Math.floor(Math.random() * (GAME.height - 100) + 50),
    gunDirection: 0,
  }
  roomsData[roomId].playerActions[player._id] = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    gunDirection: 0,
  }
  this.join(roomId)
  this.roomId = roomId
  this.playerId = player._id
}

function onEnterKey(playerAction) {
  if (roomsData[this.roomId]?.playerActions?.[this.playerId])
    Object.assign(roomsData[this.roomId].playerActions[this.playerId], playerAction)
}

const createRoom = (roomId) => {
  console.log('create', roomId)
  let intervalId = setInterval(() => handleLogic(roomId), GAME.fps)
  roomsData[roomId].intervalId = intervalId
}

const handleLogic = (roomId) => {
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
        atk: tank.atk,
        playerId: tank.playerId,
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
  for (let [playerId, tank] of Object.entries(roomsData[roomId].tanks)) {
    if (isInArea(bullet.x, bullet.y, tank.x, tank.y, TANK.bodySize / 2)) {
      let tanks = roomsData[roomId].tanks
      tanks[playerId].hp -= bullet.atk

      if (tank.hp <= 0) {
        tanks[bullet.playerId].level += 1
        updatePlayer(bullet.playerId, tanks[bullet.playerId].level)
        updatePlayer(playerId, tank.level)
        io.to(tank.socketId).emit('lose')
        io.to(tank.socketId).socketsLeave(roomId)
        delete roomsData[roomId].tanks[playerId]
        delete roomsData[roomId].playerActions[playerId]
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
  if (x1 >= x2 - r && x1 <= x2 + r && y1 >= y2 - r && y1 <= y2 + r) return true
  return false
}

const GAME = {
  width: 1000,
  height: 600,
  fps: 50,
}

const TANK = {
  tankSpeed: 5,
  bodySize: 30,
  gunLength: 30,
  bulletSpeed: 12,
  bulletSize: 6,
  bulletColor: 'blue',
}
