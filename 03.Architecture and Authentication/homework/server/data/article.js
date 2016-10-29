// module that creates the Article model in mongoDB
const mongoose = require('mongoose')

const requiredValidationMessage = '{PATH} is required'

let articleSchema = mongoose.Schema({
  // receive an author as an object, holding the author's full name and his ID in the database
  author: {
    type: Object,
    required: requiredValidationMessage
  },

  title: {
    type: String,
    required: requiredValidationMessage,
    unique: true
  },

  contents: {
    type: String,
    required: requiredValidationMessage
  },
  // Comments array of comment objects
  comments: [{
    author: {
      type: String,
      requried: requiredValidationMessage
    },

    contents: {
      type: String,
      required: requiredValidationMessage
    }
  }]


})


mongoose.model('Article', articleSchema)
