let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let connection = 'mongodb://localhost:27017/instanode-db'
let instanodeDb = require('./instanode-db')

mongoose
  .connect(connection)
  .then(() => {
    console.log('MongoDB up and running!')
    //  instanodeDb.saveImage({ url: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg', date: new Date(), description: 'such cat much wow', tags: ['cat', 'kitty', 'cute', 'catstagram'] })
    instanodeDb.findByTag('cat', (foundImages) => {
      console.log(foundImages)
    })
  })
