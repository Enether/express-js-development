let express = require('express')
let app = express()
let pug = require('pug')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let connection = 'mongodb://localhost:27017/cars-db'
mongoose.Promise = global.Promise
let path = require('path')

let addCar = require('./add-car')
let addOwner = require('./add-owner')

mongoose
  .connect(connection)
  .then(() => {
    console.log('Mongoose up and running!')
    app.set('port', process.env.PORT || 3000)
    app.set('views', path.join(__dirname, '/public'))
    app.use(bodyParser.urlencoded({ extended: true }))  // we want to parse data from forms

    app.engine('pug', pug.renderFile)
    app.use(express.static('public'))
    app.use(express.static('cars'))

    app.get('/', (req, res) => {
      res.render('index.pug')
    })

    app.get('/addCar', (req, res) => {
      let ownerSchema = require('./create-owner')
      ownerSchema
        .find()
        .where('cars')
        .equals([])  // show owners who do not have cars
        .exec((err, owners) => {
          if (err) console.log(err)

          // when the query is done, render the HTML
          res.render('add-car.pug', { savedOwners: owners })
        })
    })

    app.get('/addOwner', (req, res) => {
      res.render('add-owner.pug')
    })

    app.get('/gallery', (req, res) => {
      let carSchema = require('./create-car')
      carSchema
        .find()
        .where('imagePath')
        .ne('None')
        .exec((err, cars) => {
          if (err) console.log(err)
          // when the query is done, render the HTML
          console.log(cars)
          res.render('car-gallery.pug', {savedCars: cars})
        })
    })
    app.post('/addCar', (req, res) => {
      addCar(req)
      res.redirect('/')
    })
    app.post('/addOwner', (req, res) => {
      addOwner(req)
      res.redirect('/')
    })

    app.listen(1337)
  })
