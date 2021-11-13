const mongoose = require('mongoose')
const crypto = require('crypto')

const playerSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
)

playerSchema.methods.generatePassword = function (_password) {
  this.password = crypto.pbkdf2Sync(_password, '123456', 10000, 64, 'sha512').toString('hex')
}

playerSchema.methods.validatePassword = function (_password) {
  const password = crypto.pbkdf2Sync(_password, '123456', 10000, 64, 'sha512').toString('hex')
  return password === this.password
}

const Player = mongoose.model('Player', playerSchema)

module.exports = { Player, playerSchema }
