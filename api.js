const { Player } = require('./models/player')

const register = async (username, password) => {
  console.log(username, password)
  let check = await Player.findOne({ username })
  if (check) return { e: 1 }

  const _player = new Player({ username, hp: 10, atk: 1, level: 1 })
  _player.generatePassword(password)
  _player.save()

  return { e: 0 }
}

const login = async (username, password) => {
  let player = await Player.findOne({ username })
  if (!player || !player.validatePassword(password)) return { e: 1 }
  player.id = player._id
  return { e: 0, player }
}

const updatePlayer = (playerId, level) => {
  Player.updateOne({ _id: playerId }, { level, hp: level + 10, atk: Math.ceil(level / 5) }).then((d) => {console.log(d)})
}

module.exports = { register, login, updatePlayer }
