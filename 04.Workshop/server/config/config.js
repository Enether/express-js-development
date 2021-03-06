// this module holds information regarding our current environment
const path = require('path')
const port = process.env.port || 1337
const rootPath = path.normalize(path.join(__dirname, '../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://127.0.0.1:27017/expressjs-workshop-forum-system',
    port: port,
    sessionSecretKey: 'd3v3l0pm3nt'
  },
  production: {
    rootPath: rootPath,
    db: process.env.DATABASE_PATH,
    port: process.env.port,
    sessionSecretKey: process.env.sessionSecretKey
  }
}
