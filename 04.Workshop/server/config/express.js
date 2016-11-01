// this module sets the settings for express, like static folders, the view engine, middleware and etc
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app, config) => {
  // set the view engine and view folder
  app.set('view engine', 'pug')
  app.set('views', config.rootPath + 'server/views')


  app.use(cookieParser())  // for parsing cookies
  app.use(bodyParser.urlencoded({extended: true}))  // body parser
  app.use(session({
    // secure: true | Only if the site has HTTPS
    secret: config.sessionSecretKey,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  // middleware to attach the user to the response to show in the HTML
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }

    next()
  })

  app.use(express.static(config.rootPath + 'public'))

  console.log('Express is up and running. (:')
}
