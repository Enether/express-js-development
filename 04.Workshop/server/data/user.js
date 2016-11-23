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
  }],

  threads: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Thread'
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
  },
  isAuthor: function (article) {
    if (!article) {
      return false
    }
    return this.id.toString() === article.author.toString()
  },
  // remove an answer from the user's answers
  removeAnswer: function (answerId, resolve, reject) {
    this.answers.remove(answerId)
    this.save().then(() => {
      resolve()
    })
  }
})


const User = mongoose.model('User', userSchema)

module.exports.seedAdmin = () => {
  // create an admin user if he doesn't exist
  User.findOne({ username: 'admin' }).then(admin => {
    if (!admin) {
      let adminSalt = encryption.generateSalt()
      let adminObject = {
        username: 'admin',
        salt: adminSalt,
        hashedPass: encryption.generateHashedPassword(adminSalt, '1234'),
        roles: ['Admin']
      }

      User.create(adminObject)
    }
  })
}

