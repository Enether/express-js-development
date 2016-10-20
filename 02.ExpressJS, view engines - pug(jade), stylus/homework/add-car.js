/* this module adds a car to the database */
let mutliparty = require('multiparty')
let fs = require('fs')
let form = new mutliparty.Form()
let carSchema = require('./create-car')

function copyFile (source, target, cb) {
  // copy the file from the source directory to the target directory
  // in the callback, print out an error
  var cbCalled = false

  var readStream = fs.createReadStream(source)
  readStream.on('error', (err) => {
    done(err)
  })

  var writeStream = fs.createWriteStream(target)
  writeStream.on('error', (err) => {
    done(err)
  })

  readStream.pipe(writeStream)  // read the file and send it to our target destination

  function done (err) {
    if (!cbCalled) {
      cb(err)
      cbCalled = true
    }
  }
}

function saveImage (make, model, images) {
  if (images['displayImage'][0].originalFilename) {
    // if the user has uploaded an image
    // images should be saved in the following model
    // /cars/{car make}/{car model}/{some index}.jpg
    let carMakeDirectory = './cars/' + make
    let carModelDirectory = carMakeDirectory + '/' + model

    if (!fs.existsSync(carMakeDirectory)) {
      fs.mkdirSync(carMakeDirectory)
    }
    if (!fs.existsSync(carModelDirectory)) {
      fs.mkdirSync(carModelDirectory)
    }

    let files = fs.readdirSync(carModelDirectory + '/')
    let imageIndex = (files.Length || 0) + 1
    // due to us having a static file handler at the cars folder, save the url as
    // /cars/Ford/Mustang/1.jpg to => /Ford/Mustang/1.jpg
    let carImagePath = '/' + make + '/' + model + '/' + imageIndex + '.jpg'
    // save the image
    copyFile(images['displayImage'][0].path, carImagePath, () => { console.log('User uploaded a car image!') })

    return carImagePath
  }

  return 'None'  // if we don't have an image
}

function addCar (req) {
  form.parse(req, (error, fields, files) => {
    if (error) console.log(error)
    let carMake = fields.make
    let carModel = fields.model
    let carYear = parseInt(fields.year || 1)
    let carImagePath = saveImage(carMake, carModel, files)  // save the image of the car and get it's path'
    let carOwner = fields.carOwner[0]  // always the first element of the array, we cannot have more or less than 1 owner.

    // add the car to the owner's db record
    let ownerSchema = require('./create-owner')
    ownerSchema
      .find()
      .where('fullName')
      .equals(carOwner)
      .exec((err, owners) => {
        if (err) console.log(err)

        // add the car to the owner
        let owner = owners[0]
        owner.cars = [{carDisplayName: carYear + ' ' + carMake + ' ' + carModel,
                       carImagePath: carImagePath}]
        owner.save()
      })

    carSchema({
      make: carMake,
      model: carModel,
      owner: carOwner,
      year: carYear,
      imagePath: carImagePath
    }).save()
  })
}

module.exports = addCar
