// returns only an object that has information about the different
// dev environments
const path = require('path')
let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    port: 1337,
    db: 'mongodb://localhost:27017/authentication-class-demo',
    sessionSecretKey: 'sampl3K3y'
  },
  staging: {
  },
  production: {
    rootPath: rootPath,
    db: process.env.MONGO_DB_CONN_STRING,
    port: process.env.port,
    sessionSecretKey: 'sampl3K3yPr0duction'
  }
}
