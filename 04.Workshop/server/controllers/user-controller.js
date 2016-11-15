// this module holds the functions for the routes that are linked with users
const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')

function usernameIsValid(username) {
  // username should only have letters and numbers
  let pattern = /^[A-Za-z0-9]{3,20}$/
  return pattern.test(username)
}
function passwordIsValid(username) {
  // username should only have letters and numbers
  let pattern = /^[A-Za-z0-9]{4,20}$/
  return pattern.test(username)
}

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
    let usernameCandidate = user.username
    let passwordCandidate = user.password
    if (!usernameIsValid(usernameCandidate)) {
      res.render('user/register', { regArgs: { username: usernameCandidate }, nonFatalError: 'Username can only contain letters and numbers. It should also have minimum length of 3 and maximum length of 20!' })
      return
    } else if (!passwordIsValid(passwordCandidate)) {
      res.render('user/register', { regArgs: { username: usernameCandidate }, nonFatalError: 'Password can only contain letters and numbers. It also has a minimum length of 4 and a maximum length of 20!' })
      return
    }
    // VALIDATE!
    if (user.password !== user.password_confirm) {
      // error
      res.render('user/register', { regArgs: { username: usernameCandidate }, nonFatalError: 'Your passwords do not match :@' })
      return
    } else {
      // check same username
      User
        .find({ username: usernameCandidate })
        .then(user => {
          if (user) {
            res.render('user/register', { regArgs: { username: usernameCandidate }, nonFatalError: 'Such an username already exists!' })
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
    let passwordCandidate = loginUser.password
    if (!usernameIsValid(usernameCandidate)) {
      res.render('user/login', { logArgs: { username: usernameCandidate }, nonFatalError: 'Username can only contain letters and numbers. It should also have minimum length of 3 and maximum length of 20!' })
      return
    } else if (!passwordIsValid(passwordCandidate)) {
      res.render('user/login', { logArgs: { username: usernameCandidate }, nonFatalError: 'Password can only contain letters and numbers. It also has a minimum length of 4 and a maximum length of 20!' })
      return
    }
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

