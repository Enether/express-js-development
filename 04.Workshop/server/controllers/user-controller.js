// this module holds the functions for the routes that are linked with users
let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

module.exports = {
  showRegister: (req, res) => {
    res.render('user/register')
  },

  showLogin: (req, res) => {
    res.render('user/login')
  },

  register: (req, res) => {
    let user = req.body

    if (user.password !== user.password_confirm) {
      // error
    } else {
      // check same username
    }
    delete user.confirm_password  // remove the useless confirm_password field because we're going to be saving to the DB

    user.salt = encryption.generateSalt()
    user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

    User
      .create(user)
      .then((user) => {
        req.logIn(user, (err, user) => {
          if (err) {
            console.log('Error while logging in!')
          }

          res.redirect('/')
        })
      })
  },

  login: (req, res) => {
    let loginUser = req.body

    User
      .findOne({'username': loginUser.username})
      .then((user) => {
        if (!user) {
          // invalid username
          console.log('Invalid Username!')
        } else {
          // validate password
          let salt = user.salt
          let loginHashedPassword = encryption.generateHashedPassword(salt, loginUser.password)

          if (loginHashedPassword !== user.hashedPass) {
            // invalid password
            console.log('Invalid Password!')
          } else {
            // everything is OK
            req.logIn(user, (err, user) => {
              if (err) {
                // Error
              } else {
                res.redirect('/')
              }
            })
          }
        }



      })
  }
}

