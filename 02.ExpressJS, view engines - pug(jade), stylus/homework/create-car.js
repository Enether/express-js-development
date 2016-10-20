/* this module creates the schema for an image */
let mongoose = require('mongoose')

let carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number
})
let Car = mongoose.model('Car', carSchema)

module.exports = Car
