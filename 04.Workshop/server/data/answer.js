const mongoose = require('mongoose')

let answerSchema = mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId, // to article
    required: true,
    ref: 'Thread'
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,  // to user
    required: true,
    ref: 'User'
  },

  creationDate: {
    type: Date,
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
  }
})

mongoose.model('Answer', answerSchema)
