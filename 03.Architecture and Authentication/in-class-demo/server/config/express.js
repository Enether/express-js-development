const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')


module.exports = (config, app) => {
  // attach middlewares
  app.set('view engine', 'pug')
  app.set('views', config.rootPath + 'server/views')
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: config.sessionSecretKey,
    resave: false,
    saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())

  // attach user to request
  app.use((req, res, next) => {
    if (req.user) {
        // bad practice!
        // app.locals.currentUser = req.user        
        // DONT DO!

      res.locals.currentUser = req.user
    }
    next()
  })

  app.use(express.static(config.rootPath + 'public'))
}
