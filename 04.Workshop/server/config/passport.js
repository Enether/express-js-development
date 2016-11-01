const passport = require('passport')
const LocalPassport = require('passport-local')
const User = require('mongoose').model('User')

module.exports = () => {
  passport.use(
    new LocalPassport(
      {
        // by default Passport takes the username value from req.body.email
        // we don't want this, so we set the parameter ourselves
        usernameField: 'username',  // needs to be the same with the ID in the HTML input tag
        passwordField: 'password'
      },
      // second LocalPassport argument
      (username, password, done) => {
      // authenticate user
        User
        .findOne({username: username})
        .then(user => {
          if (!user || !user.authenticate(password)) return done(null, false)

          return done(null, user)
        })
      }))

  // here we need to tell Passport how to differentiate users by some unique value. In our case - his DB id
  passport.serializeUser((user, done) => {
    if (user) return done(null, user._id)
  })

  // here, given the unique value we gave in the method serializeUser above, we need to
  // find the User from the DB and return his object
  passport.deserializeUser((id, done) => {
  // bad practice, better to add the user id to the cookie
    User
      .findById(id)
      .then(user => {
        if (!user) return done(null, false)
        return done(null, user)
      })
  })
}
