// this module holds the functions for the routes that are linked with users
const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')

function validateUsernameAndPassword (res, user, pageUrl) {
  // given a user object, make sure their username and password fit in our criteria for a valid username/password
  // if not, handle it by rendering the given page with an appropriate message
  let usernameCandidate = user.username
  let passwordCandidate = user.password
  if (!usernameIsValid(usernameCandidate)) {
    res.render(pageUrl, { userArgs: { username: usernameCandidate }, nonFatalError: 'Username can only contain letters and numbers. It should also have minimum length of 3 and maximum length of 20!' })
    return false
  } else if (!passwordIsValid(passwordCandidate)) {
    res.render(pageUrl, { userArgs: { username: usernameCandidate }, nonFatalError: 'Password can only contain letters and numbers. It also has a minimum length of 4 and a maximum length of 20!' })
    return false
  }

  return true
}

function usernameIsValid (username) {
  // username should only have letters and numbers
  let pattern = /^[A-Za-z0-9]{3,20}$/
  return pattern.test(username)
}
function passwordIsValid (username) {
  // username should only have letters and numbers
  let pattern = /^[A-Za-z0-9]{4,20}$/
  return pattern.test(username)
}

module.exports = {
  showRegister: (req, res) => {
    res.render('user/register', { userArgs: {} })
  },

  showLogin: (req, res) => {
    res.render('user/login', { userArgs: {} })
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

        res.render('user/profile', { user: user, threads: user.threads, answers: user.answers })
      })
  },

  register: (req, res) => {
    let user = req.body
    if (validateUsernameAndPassword(res, user, 'user/register')) {
      // VALIDATE!
      if (user.password !== user.password_confirm) {
        // error
        res.render('user/register', { userArgs: { username: user.username }, nonFatalError: 'Your passwords do not match :@' })
        return
      } else {
        // check same username
        User
          .findOne({ username: user.username })
          .then(userExists => {
            if (userExists) {
              res.render('user/register', { userArgs: { username: user.username }, nonFatalError: 'Such an username already exists!' })
              return
            } else {
              delete user.confirm_password  // remove the useless confirm_password field because we're going to be saving to the DB

              user.salt = encryption.generateSalt()
              user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

              User
                .create(user)
                .then((newUser) => {
                  req.logIn(newUser, (err, newUser) => {
                    if (err) {
                      req.session.nonFatalError = 'Error while logging in after registration :('
                    }

                    res.redirect('/')
                  })
                })
            }
          })
      }
    }
  },

  login: (req, res) => {
    let loginUser = req.body

    if (validateUsernameAndPassword(res, loginUser, 'user/login')) {  // checks if the given username and password are valid in of themselves and handles if they are not
      User
        .findOne({ 'username': loginUser.username })
        .then((user) => {
          if (!user || !user.authenticate(loginUser.password)) {
            // invalid username or password
            res.render('user/login', { userArgs: { username: loginUser.username }, nonFatalError: 'Invalid credentials!' })
            return
          } else {
            // everything is OK
            req.logIn(user, (err, user) => {
              if (err) {
                // Append the message to the session
                req.session.nonFatalError = err.message
              }
              res.redirect('/')
            })
          }
        })
    }
  }
}

