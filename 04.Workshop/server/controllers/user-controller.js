// this module holds the functions for the routes that are linked with users
const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  showRegister: (req, res) => {
    res.render('user/register', { regArgs: {} })
  },

  showLogin: (req, res) => {
    res.render('user/login', { logArgs: {} })
  },

  showProfile: (req, res) => {
    let username = req.params.username
    User
      .findOne({ username: username })
      .populate(['answers', 'threads'])
      .then((user) => {
        if (!user) {
          // ERROR!!!
          req.session.nonFatalError = 'Invalid User!'
          res.redirect('/')
        }

        // get the threads he has started
        res.render('user/profile', { user: user, threads: user.threads, answers: user.answers })
      })
  },

  register: (req, res) => {
    let user = req.body

    if (user.password !== user.password_confirm) {
      // error
      res.render('user/register', { regArgs: { username: user.username }, nonFatalError: 'Your passwords do not match :@' })
      return
    } else {
      // check same username
      User
        .find({ username: user.username })
        .then(user => {
          if (user) {
            res.render('user/register', { regArgs: { username: user.username }, nonFatalError: 'Such an username already exists!' })
            return
          } else {
            delete user.confirm_password  // remove the useless confirm_password field because we're going to be saving to the DB

            user.salt = encryption.generateSalt()
            user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

            User
              .create(user)
              .then((user) => {
                req.logIn(user, (err, user) => {
                  if (err) {
                    req.session.nonFatalError = 'Error while logging in after registration :('
                  }

                  res.redirect('/')
                })
              })
          }
        })
    }
  },

  login: (req, res) => {
    let loginUser = req.body
    let usernameCandidate = loginUser.username
    User
      .findOne({ 'username': usernameCandidate })
      .then((user) => {
        if (!user) {
          // invalid username
          res.render('user/login', { logArgs: { username: usernameCandidate }, nonFatalError: 'Invalid credentials!' })
          return
        } else {
          // validate password
          let salt = user.salt
          let loginHashedPassword = encryption.generateHashedPassword(salt, loginUser.password)

          if (loginHashedPassword !== user.hashedPass) {
            // invalid password
            res.render('user/login', { logArgs: { username: usernameCandidate }, nonFatalError: 'Invalid credentials!' })
            return
          } else {
            // everything is OK
            req.logIn(user, (err, user) => {
              if (err) {
                // Error
                req.session.nonFatalError = err.message
                res.redirect('/')
              } else {
                res.redirect('/')
              }
            })
          }
        }
      })
  }
}

