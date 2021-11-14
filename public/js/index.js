let socket = io()
let player = {}
let roomsData = {}

let gameContainerNode = document.querySelector('.game-container')
let formSignInNode = document.querySelector('#form-sign-in')

let hpNumNode = document.querySelector('.hp-num')
let hpColorNode = document.querySelector('.hp-color')

socket.on('data', (data) => {
  roomsData = data
  console.log(data)
  hpNumNode.innerHTML = data.tanks[player._id].hp
  hpColorNode.style.width = `${(data.tanks[player._id].hp / player.hp) * 10}rem`
})

socket.on('lose', () => {
  Game.stop()
  gameContainerNode.classList.add('hidden')
  formSignInNode.classList.remove('hidden')
})
