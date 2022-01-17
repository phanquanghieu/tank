let socket = io()
let player = {}
let roomsData = {}

let gameContainerNode = document.querySelector(".game-container")
let formSignInNode = document.querySelector("#form-sign-in")

let hpNumNode = document.querySelector(".hp-num")
let hpColorNode = document.querySelector(".hp-color")

socket.on("data", (data) => {
  roomsData = data
  console.log(data)
  hpNumNode.innerHTML = data.tanks[player._id].hp
  hpColorNode.style.width = `${(data.tanks[player._id].hp / player.hp) * 10}rem`
  document.querySelector(".player-level").innerHTML =
    data.tanks[player._id].level
  document.querySelector(".player-atk").innerHTML = data.tanks[player._id].atk
})

socket.on("roomChange", (roomsInfo) => {
  let listRoom = ""
  roomsInfo.forEach((room) => {
    listRoom += `
      <div  class='room-item btnJoin' data-roomId='${room.id}'>
          <div>${room.name}</div>
          <div class='room-count'>${numPlayer}/4</div>
      </div>
      `
  })
  console.log(roomsInfo, listRoom)
  document.querySelector(".list-room").innerHTML = listRoom
})

socket.on("lose", () => {
  Game.stop()
  gameContainerNode.classList.add("hidden")
  formSignInNode.classList.remove("hidden")
})
