/* this module adds a car to the database */
let carSchema = require('./create-car')

function addCar (carInfo) {
  let carMake = carInfo.make
  let carModel = carInfo.model
  let carYear = parseInt(carInfo.year || 1)

  carSchema({
    make: carMake,
    model: carModel,
    year: carYear
  }).save()
}

module.exports = addCar
