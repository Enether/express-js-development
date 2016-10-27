// module that creates the User model in mongoDB
const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: requiredValidationMessage,
    unique: true
  },

  firstName: {
    type: String,
    required: requiredValidationMessage
  },

  lastName: {
    type: String,
    required: requiredValidationMessage
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

let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
  // method to create a pre-defined admin user when the DB is empty
  User
    .find({})
    .then((users) => {
      if (users.length === 0) {  // if the DB is empty
        let salt = encryption.generateSalt()
        let hashedPass = encryption.generateHashedPassword(salt, 'admin123')

        User.create({
          username: 'enether',
          firstName: 'Stanislav',
          lastName: 'Kozlovski',
          salt: salt,
          hashedPass: hashedPass,
          roles: ['Admin']
        })
      }
    })
}
