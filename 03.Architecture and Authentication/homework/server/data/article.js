// moduel that creates the Article model in modelDB
const mongoose = require('mongoose')

const requiredValidationMessage = '{PATH} is required'

let articleSchema = mongoose.Schema({
  // receive an author as an object, holding the author's full name and his ID in the database
  author: {
    type: Object,
    required: requiredValidationMessage,
  },

  title: {
    type: String,
    required: requiredValidationMessage,
    unique: true
  },

  contents: {
    type: String,
    required: requiredValidationMessage
  }
})


let Article = mongoose.model('Article', articleSchema)
