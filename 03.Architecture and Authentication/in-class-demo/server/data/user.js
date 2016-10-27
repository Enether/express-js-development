const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: { type: String,
    required: requiredValidationMessage,
    unique: true },
  firstName: { type: String, required: requiredValidationMessage },
  secondName: { type: String, required: requiredValidationMessage },
  salt: String,
  hashedPass: String,
  roles: [String]
})

// add authenticate method to the User model to detect if the password is correct
userSchema.method({
  authenticate: function (password) {
    if (encryption.generateHashedPassword(this.salt, password) ===
     this.hashedPass) { return true } else { return false }
  }
})


let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
  // create an admin user if the database does not have any users
  User.find({}).then((users) => {
    if (users.length === 0) {
      let salt = encryption.generateSalt()  // get a random salt
      let hashedPass = encryption.generateHashedPassword(salt, 'Ivaylo')  // get the hashed password with the generated salt
      // seeding an admin on server start up
      User.create({
        username: 'ivaylo.kenov',
        firstName: 'Ivaylo',
        secondName: 'Kenov',
        salt: salt,
        hashedPass: hashedPass,
        roles: ['Admin']})
    }
  })
}
