let express = require('express')
let app = express()
let pug = require('pug')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let favicon = require('serve-favicon')
let connection = 'mongodb://localhost:27017/cars-db'
mongoose.Promise = global.Promise
let path = require('path')

let addCar = require('./add-car')
let addOwner = require('./add-owner')
let ownerSchema = require('./create-owner')
let carSchema = require('./create-car')

mongoose
  .connect(connection)
  .then(() => {
    console.log('Mongoose up and running!')

    // favicon middleware
    app.use(favicon(path.join(__dirname, '/public/favicon.ico')))
    app.set('port', process.env.PORT || 3000)
    app.set('views', path.join(__dirname, '/public'))
    app.use(bodyParser.urlencoded({ extended: true }))  // we want to parse data from forms

    app.engine('pug', pug.renderFile)
    app.use(express.static('public'))
    app.use(express.static('cars'))
    app.use(express.static('owners'))

    // homepage
    app.get('/', (req, res) => {
      res.render('index.pug')
    })

    // list of owners
    app.get('/owners', (req, res) => {
      // render a page with all the people that have a car
      ownerSchema
        .find()
        .where('cars')
        .ne([])
        .exec((err, savedOwners) => {
          if (err) console.log(err)
          res.render('owners-list.pug', {owners: savedOwners})
        })
    })

    // open a page which lets you add a car to the database and append it to an person
    app.get('/addCar', (req, res) => {
      ownerSchema
        .find()
        .where('cars')
        .equals([])  // show owners who do not have cars linked to them
        .exec((err, owners) => {
          if (err) console.log(err)

          // when the query is done, render the HTML
          res.render('add-car.pug', { carlessPeople: owners })
        })
    })

    app.get('/addOwner', (req, res) => {
      res.render('add-owner.pug')
    })

    // open a specific owner's profile page
    app.get('/owners/:ownerName', (req, res) => {
      ownerSchema
        .find()
        .where('fullName')
        .equals(req.params.ownerName)
        .exec((err, people) => {
          if (err) console.log(err)

          if (people.length !== 1) {
            // either duplicate owners exist or no such owner exists
            // in which case, redirect to the owners list
            res.redirect('/owners')
          } else {
            let owner = people[0]
            res.render('owner.pug', {person: owner})
          }
        })
    })

    // open the gallery page holding pictures of all the cars in the DB
    app.get('/gallery', (req, res) => {
      carSchema
        .find()
        .where('imagePath')
        .ne('None')
        .exec((err, cars) => {
          if (err) console.log(err)

          // when the query is done, render the HTML
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
