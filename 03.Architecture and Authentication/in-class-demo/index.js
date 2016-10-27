const express = require('express')

let app = express()
let env = process.env.NODE_ENV || 'development'

// get the appropriate configuration settings for the current environment
let config = require('./server/config/config')[env]

// node environment for deployment
// set NODE_END="development"
//          production or development
// set MONGO_DB="mongopath"
// used to hide DB path from developers
let port = process.env.port || 1337


// set up the DB with the configuration
require('./server/config/database')(config)

require('./server/config/express')(config, app)

require('./server/config/routes')(app)

require('./server/config/passport')()

app.listen(port)
