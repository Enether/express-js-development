let mongoose = require('mongoose')
mongoose.Promise = global.Promise

let Cat = mongoose.model('Cat', {
  name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  age: Number
})

// Better way
let catSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  age: Number
})
catSchema.methods.sayHello = () => {
  console.log('meow')
}

// virtual property, is not saved in the DB
catSchema.virtual('introduction').get(function () {  // !!! Can't use () => !!! because of this. and lambdas
  return this.someRandomValue
})
catSchema.virtual('introduction').set(function (value) {
  this.someRandomValue = value
})

catSchema.path('name').validate(value => {
  return value !== 'Pesho'
}, 'Sorry, the name cannot be "Pesho"')
let Cat2 = mongoose.model('Cat2', catSchema)

let connection = 'mongodb://localhost:27017/mongoosedb'

mongoose
  .connect(connection)
  .then(() => {
    console.log('MongoDB up and running!')

    new Cat({
      name: {
        firstName: 'ivan',
        lastName: 'Shopa'
      },
      age: 5
    })
    .save()
    .then(console.log)

    // will give error
    new Cat({
      age: 5
    }).save()

    Cat.find({'name.lastName': 'Shopa'})

    let cat_2 = Cat2({
      name: 'te',
      lastName: 'te',
      age: 5
    })
    cat_2.sayHello()

    console.log(cat_2.introduction)
    cat_2.introduction = 'HELLO!'
    console.log(cat_2.introduction)

    // read cats
    Cat2.find({name: /a//* regex */}).then(console.log)
    Cat2.find({age: {$gt: 3}}).then(console.log)  // cat's with age greater than 3
    // $lt less than

    Cat2.findById('yadayada')

    // update cats
    Cat2.find().exec().then(cat => {
      cat.name = 'E'
      cat.save()
    })

    Cat2.findByIdAndUpdate('yada', {
      $set: {age: 38, name: '34'}
    })

    Cat2.update(
      {name: 'Kittens'},  // where name == Kittens
      {$set: {name: 'NoMoreKittens'}}
  )
  .then(console.log)


    Cat2.find()
  .where('name').equals('Te')
  .then(console.log)

    let page = 1
    let pageSize = 20
    Cat2
  .find()
  .where('age').gt(5)
  .skip((page - 1) * pageSize)
  .limit(3)  // don't take more than 3'
  .sort('-age')  // age descending
  .select('name age')  // take the name and age only
  .then(console.log)
  })
