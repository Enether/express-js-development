const mongoose = require('mongoose')

mongoose.Promise = global.Promise

module.exports = (config) => {
  mongoose.connect(config.db)
  let db = mongoose.connection

  db.once('open', (err) => {
    if (err) throw err
    console.log('MongoDB is up and running. (:')
  })

  db.on('error', (err) => { console.log('Database error: ' + err) })

  require('../data/user')
}

