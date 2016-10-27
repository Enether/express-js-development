let express = require('express')
let app = express()

// get the environment of the web app and the appropriate settings
const env = process.env.NODE_ENV || 'development'
const config = require('./server/config/config')[env]

// initialize the database
require('./server/config/database')(config)

// set express settings like middleware and view engines
require('./server/config/express')(app, config)

// set the routes
require('./server/config/router')(app)

// set the passport settings
require('./server/config/passport')()

app.listen(config.port)

