const { Player } = require('./models/player')

const router = require('express').Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(username, password)
  let check = await Player.findOne({ username })
  if (check) return res.json({ e: 1 })
  const _player = new Player({ username })
  _player.generatePassword(password)
  _player.save()
  return res.json({ e: 0 })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  let player = await Player.findOne({ username })
  if (!player || !player.validatePassword(password)) return res.json({ e: 1 })
  return res.json({ e: 0, player})
})

module.exports = router