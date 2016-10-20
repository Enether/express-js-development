let express = require('express')
let bodyParser = require('body-parser')
let app = express()


app.set('view engine', 'pug')
app.set('views', './')

app.get('/', (req, res) => {
  res.render('view', {title: 'Hi!', myArray: [1, 2, 3, 4]})
})
app.use(bodyParser.urlencoded({ extended: true }))  // we want to parse data from forms

app.post('/create', (req, res) => {
  console.log(req.body)  // form will be readily parsed from body-parser
})

// middleware
app.use('some_url', (req, res, next) => {
  console.log('First Middleware')
  req.someValue = 5  // append something to the request
  next()
})

app.use((req, res, next) => {
    // this middleware will get the modified request
  console.log(req.someValue)
  console.log('Second Middleware')
  next()  // calls the next middleware
})


app.use(express.static('public'))

// be cautious how you order them
app.get('/', (req, res) => {
  res.send('Something')
})

app.get('/all', (req, res) => {
  res.send('All from GET')
})

app.post('/all', (req, res) => {
  res.send('All from POST')
})

// regex - * matches all
// app.all('*', (req, res) => {
//     res.send('Matches everything')
//     res.send('error!')
// })

// paths can have parameters
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)

  console.log(req.params.userId)
})


app.listen(1337)
