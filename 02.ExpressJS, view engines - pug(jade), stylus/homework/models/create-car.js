/* this module creates the schema for a car */
let mongoose = require('mongoose')

let carSchema = new mongoose.Schema({
  make: String,
  model: String,
  owner: String,
  year: Number,
  imagePath: String
})
let Car = mongoose.model('Car', carSchema)
module.exports = Car
