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

  roles: [String],

  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Answer'
  }]
})

// add authenticate method to the DB model for easy authentication
userSchema.method({
  authenticate: function (password) {
    if (encryption.generateHashedPassword(this.salt, password) === this.hashedPass) {
      return true
    } else {
      return false
    }
  },
  isAdmin: function () {
    return this.roles.indexOf('Admin') > -1
  }
})


mongoose.model('User', userSchema)

