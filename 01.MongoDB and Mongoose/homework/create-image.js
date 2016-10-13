/* this module creates the schema for an image */
let mongoose = require('mongoose')

let imageSchema = new mongoose.Schema({
  url: {type: String, required: true},
  creationDate: Date,
  description: String,
  tags: Array
})
let Image = mongoose.model('Image', imageSchema)

module.exports = Image
