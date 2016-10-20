let express = require('express')
let app = express()
let pug = require('pug')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let path = require('path')

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
  require('add-car')(req.body)
})

app.listen(1337)
