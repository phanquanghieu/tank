handleLogin = () => {
  document.getElementById('form').innerHTML = `
     <div class="d-flex ali-center">
            <p class="title-input">Tên tài khoản</p>
            <input id='i-username' class="input-value" placeholder="Nhập tên tài khoản"/>
        </div>
        <div class="d-flex ali-center">
            <p class="title-input">Mật khẩu</p>
            <input id='i-password' class="input-value" placeholder="Nhập mật khẩu"/>
        </div>
        
        <div class='error'></div>
        <div class="footer d-flex jc-center">
        <button onclick="handleGoGame()">Đăng nhập</button>
      </div>
    `
}
handleRegister = () => {
  document.getElementById('form').innerHTML = `
     <div class="d-flex ali-center">
            <p class="title-input">Tên tài khoản</p>
            <input id='i-username' class="input-value" placeholder="Nhập tên tài khoản"/>
        </div>
        <div class="d-flex ali-center">
            <p class="title-input">Mật khẩu</p>
            <input id='i-password' class="input-value" placeholder="Nhập mật khẩu"/>
        </div>
        <div class='error'></div>
        <div class="footer d-flex jc-center">
        <button onclick="register()">Đăng Ký</button>
      </div>
    `
}

register = async () => {
  let iUsername = document.querySelector('#i-username')
  let iPassword = document.querySelector('#i-password')
  socket.emit('register', { username: iUsername.value, password: iPassword.value })
}

handleGoGame = async () => {
  let iUsername = document.querySelector('#i-username')
  let iPassword = document.querySelector('#i-password')
  socket.emit('login', { username: iUsername.value, password: iPassword.value })
}

socket.on('resRegister', (data) => {
  if (data.e) {
    document.querySelector('.error').innerHTML = "Tài khoản đã tồn tại"
    return
  }
  handleLogin()
})

socket.on('resLogin', (data) => {
  if (data.e) {
    document.querySelector('.error').innerHTML = "Tài khoản hoặc mật khẩu không chính xác"
    return
  }

  player = data.player

  document.querySelector('.player-name').innerHTML = data.player.username
  document.querySelector('.player-level').innerHTML = data.player.level
  document.querySelector('.player-atk').innerHTML = data.player.atk

  let listRoom = ''

  data.roomsInfo.forEach((room) => {
    listRoom += `
      <div  class='room-item btnJoin' data-roomId='${room.id}'>
          <div>${room.name}</div>
          <div class='room-count'>1/4</div>
      </div>
      `
  })

  document.getElementById('form-sign-in').innerHTML = `
    <div id="select-room">
    <div class="header">
        <h1>Xin chào ${data.player.username}</h1>
    </div>
    <div class="header">
        <p>Hãy chọn phòng</p>
    </div>
    <div class="list-room">
    ${listRoom}
    </div>
    </div>
    `

  let btnJoinsNode = document.querySelectorAll('.btnJoin')
  for (let btnJoinNode of btnJoinsNode) {
    btnJoinNode.addEventListener('click', () => {
      gameContainerNode.classList.remove('hidden')
      formSignInNode.classList.add('hidden')
      socket.emit('joinRoom', {
        roomId: btnJoinNode.getAttribute('data-roomId'),
        player: data.player,
      })
      Game.init()
    })
  }
})
