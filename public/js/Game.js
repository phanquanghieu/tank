const Game = {
  canvas: document.querySelector('#canvas'),
  c: canvas.getContext('2d'),
  intervalId: null,
  fps: 50,

  playerAction: {
    up: false,
    right: false,
    down: false,
    left: false,
    fire: false,
    mousePos: { x: 0, y: 0 },
  },

  init() {
    canvas.width = 1000
    canvas.height = 600

    window.addEventListener('keydown', Game.handleKeyBoard)
    window.addEventListener('keyup', Game.handleKeyBoard)
    canvas.addEventListener('mousemove', Game.handleMouseMove)
    canvas.addEventListener('click', Game.handleFire)

    Game.intervalId = setInterval(() => {
      socket.emit('enterKey', Game.playerAction)
      Game.playerAction.fire = false
    }, Game.fps)

    Game.run()
  },

  run() {
    requestAnimationFrame(Game.run)

    Game.c.clearRect(0, 0, canvas.width, canvas.height)

    Object.values(roomsData.tanks).forEach((tank) => {
      Tank.drawTank(tank)
    })

    roomsData.bullets.forEach((bullet) => {
      Tank.drawBullet(bullet)
    })

    console.log('run')
  },

  stop() {
    clearInterval(Game.intervalId)
  },

  handleKeyBoard(e) {
    Game.playerAction[KEY_CODE[e.code]] = e.type === 'keydown'
  },

  handleMouseMove(e) {
    Game.playerAction.mousePos = {
      x: e.offsetX,
      y: e.offsetY,
    }
  },

  handleFire(e) {
    e.preventDefault()
    e.stopPropagation()
    Game.playerAction.fire = true
  },
}

const KEY_CODE = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
}
