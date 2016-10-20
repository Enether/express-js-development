let express = require('express')
let app = express()
let pug = require('pug')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let connection = 'mongodb://localhost:27017/cars-db'
mongoose.Promise = global.Promise
let path = require('path')

let addCar = require('./add-car')

mongoose
  .connect(connection)
  .then(() => {
    console.log('Mongoose up and running!')
    app.set('port', process.env.PORT || 3000)
    app.set('views', path.join(__dirname, '/public'))
    app.use(bodyParser.urlencoded({ extended: true }))  // we want to parse data from forms

    // used below code to render html files
    app.engine('pug', pug.renderFile)
    app.use(express.static('public'))

    app.get('/', (req, res) => {
      res.render('index.pug')
    })

    app.get('/addCar', (req, res) => {
      res.render('add-car.pug')
    })

    app.post('/addCar', (req, res) => {
      addCar(req)
      res.redirect('/')
    })

    app.listen(1337)
  })
