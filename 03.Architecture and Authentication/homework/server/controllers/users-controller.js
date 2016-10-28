// this module returns an object with teh functions for the routes associated with the user
let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

// TODO: Change register to registerPage, create to register, login to loginPage and ETC

module.exports = {
  // #1 display the register page
  register: (req, res) => {
    res.render('users/register')
  },
  // #2 add the user in the DB
  create: (req, res) => {
    let user = req.body

    // validate info
    if (user.password !== user.confirmPassword) {
      // have the globalError in the user so that we return the user object back
      // for the HTML to display the username in the box again
      user.globalError = 'Passwords do not match!'
      res.render('users/register', user)
      return
    } else {
      // check same username
      User
        .find({'username': user.username})
        .then((users) => {
          if (users.length !== 0) {
            // we already have a user with such a username
            user.globalError = 'There already is a user with the username ' + user.username
            res.render('users/register', user)
            return
          }
        })
    }

    user.salt = encryption.generateSalt()
    user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

    User
      .create(user)
      .then(user => {
        req.logIn(user, (err, user) => {
          if (err) {
            res.render('users/register', { globalError: 'Error with logging in' })
            return
          }
        })

        res.redirect('/')
      })
  },
  // #3 display the login page
  login: (req, res) => {
    res.render('users/login')
  },
  // #4 login the user
  authenticate: (req, res) => {
    let inputUser = req.body

    User
      .findOne({ username: inputUser.username })
      .then(user => {
        // try to authenticate using the userSchema method
        if (!user.authenticate(inputUser.password)) {
          res.render('users/login', { globalError: 'Invalid username or password' })
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.render('users/login', { globalError: 'Error with logging in' })
            return
          }

          res.redirect('/')
        })
      })
  },
  // #5 logout the user
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
