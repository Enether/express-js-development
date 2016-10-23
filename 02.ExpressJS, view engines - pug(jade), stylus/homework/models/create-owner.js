/* this module creates the schema for a car owner */
let mongoose = require('mongoose')

let ownerSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  fullName: {type: String, required: true},
  imagePath: {type: String, requiredD: true},
  car: Object
},
{ minimize: false })  // we want to be able to save empty objects
let Owner = mongoose.model('Owner', ownerSchema)
module.exports = Owner
