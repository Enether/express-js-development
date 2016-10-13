let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let connection = 'mongodb://localhost:27017/instanode-db'
let instanodeDb = require('./instanode-db')

mongoose
  .connect(connection)
  .then(() => {
    console.log('MongoDB up and running!')
    // save the image
    instanodeDb.saveImage({ url: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg', date: new Date(), description: 'such cat much wow', tags: ['cat', 'kitty', 'cute', 'catstagram'] })
    // find the image by tag
    instanodeDb.findByTag('cat', (foundImages) => {
      console.log(foundImages)
    })
    // filter images by date
    instanodeDb.filter({after: new Date('October 13, 2014 11:13:00'), results: 3}, (err, objects) => {
      if (err) console.log(err)
      console.log(objects)
    })
  })
