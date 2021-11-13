let socket = io()
let roomsData = {}

let hpNumNode = document.querySelector('.hp-num')
let hpColorNode = document.querySelector('.hp-color')
let btnCreateNode = document.querySelector('#btnCreate')
let btnJoinNode = document.querySelector('#btnJoin')

socket.on('data', (data) => {
  roomsData = data
  console.log(data)
  hpNumNode.innerHTML = data.tanks[socket.id].hp
  hpColorNode.style.width = `${data.tanks[socket.id].hp/5*10}rem`
})

socket.on('lose', () => {
  Game.stop()
})

btnCreateNode.addEventListener('click', () => {
  socket.emit('createRoom')

  Game.init()
})

btnJoinNode.addEventListener('click', () => {
  socket.emit('joinRoom', { roomId: 'room1' })

  Game.init()
})
// window.addEventListener('keydown', handleKeyDown)
