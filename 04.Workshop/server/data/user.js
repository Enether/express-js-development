const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  salt: String,

  hashedPass: String,

  roles: [String]
})

// add authenticate method to the DB model for easy authentication
userSchema.method({
  authenticate: function (password) {
    if (encryption.generateHashedPassword(this.salt, password) === this.hashedPass) {
      return true
    } else {
      return false
    }
  }
})

mongoose.model('User', userSchema)
