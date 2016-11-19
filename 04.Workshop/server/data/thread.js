const mongoose = require('mongoose')

let threadSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  id: {
    type: Number,
    required: true,
    unique: true
  },

  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Answer'
  }],

  views: { type: Number, default: 0 }
})

// middleware to remove every dependant document on deletion
threadSchema.pre('remove', true, function (next, done) {
  const Answer = mongoose.model('Answer')
  let promises = []
  // fill promises with promises of answer deletions
  for (let answerId of this.answers) {
    promises.push(new Promise((resolve, reject) => {
      Answer.findById(answerId).then((answer) => {
        answer.remove().then(() => {
          resolve()
        })
      })
    }))
  }

  Promise.all(promises).then(() => {
    done()
    next()
  })
})

mongoose.model('Thread', threadSchema)

