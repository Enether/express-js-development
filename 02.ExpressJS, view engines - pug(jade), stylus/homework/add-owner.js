/* this module adds an owner to the database */
let mutliparty = require('multiparty')
let fs = require('fs')
let gm = require('gm')  // used to resize images
let form = new mutliparty.Form()
let ownerSchema = require('./create-owner')

function copyFile (source, target, cb) {
  // copy the file from the source directory to the target directory
  // in the callback, print out an error if there is any
  var cbCalled = false

  var writeStream = fs.createWriteStream(target)
  writeStream.on('error', (err) => {
    done(err)
  })
  // get the source image and change it's dimensions to 702width 936height
  gm(source)
  .resize('702', '936', '!')  // forse a resize to the specified dimensions
  .stream()
  .pipe(writeStream)

  function done (err) {
    if (!cbCalled) {
      cb(err)
      cbCalled = true
    }
  }
}

function saveImage (firstName, lastName, images) {
  if (images['displayImage'][0].originalFilename) {  // if the user has uploaded an image
    // images should be saved in the following model
    // /owners/{Owner Name}/{some index}.jpg
    let fullName = firstName + ' ' + lastName
    let ownerDirectory = './owners/' + firstName + ' ' + lastName

    if (!fs.existsSync(ownerDirectory)) {
      fs.mkdirSync(ownerDirectory)
    }

    let files = fs.readdirSync(ownerDirectory + '/')
    let imageIndex = (files.Length || 0) + 1
    // due to us having a static file handler at the owners folder, save the url as
    // /owners/Stanislav Kozlovski/1.jpg to => /Stanislav Kozlovski/1.jpg
    let ownerImagePath = '/' + fullName + '/' + imageIndex + '.jpg'
    let ownerDestinationImagePath = './owners' + ownerImagePath
    // save the image
    copyFile(images['displayImage'][0].path, ownerDestinationImagePath, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Owner image saved successfully to ' + '.' + ownerDestinationImagePath)
      } })

    return ownerImagePath
  }

  return 'None'  // if we don't have an image
}

function addOwner (req) {
  form.parse(req, (error, fields, files) => {
    if (error) console.log(error)
    let ownerFirstName = fields.firstName
    let ownerLastName = fields.lastName
    let ownerImagePath = saveImage(ownerFirstName, ownerLastName, files)  // save the image of the car and get it's path'

    ownerSchema({
      firstName: ownerFirstName,
      lastName: ownerLastName,
      fullName: ownerFirstName + ' ' + ownerLastName,
      cars: [],
      imagePath: ownerImagePath
    }).save()
  })
}

module.exports = addOwner
