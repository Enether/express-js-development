let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let _ = require('lodash')
let imageSchema = require('./create-image')

function saveImage (imageInfo) {
  // save an image to the DB
  imageSchema({
    url: imageInfo.url,
    creationDate: imageInfo.date,
    description: imageInfo.description,
    tags: imageInfo.tags
  }).save()
  imageSchema.findByT
}

function findByTag (tag, callback) {
  // this function searches the database for images that have the corresponding tag
  console.log('Trying to find images with the tag ' + tag + ' in them.')
  imageSchema.find({}).then(function (docs) {
    let imagesWithTag = []  // array we'll be returning

    for (let idx in docs) {
      let image = docs[idx]._doc

      if (_.includes(image.tags, tag)) {  // if the image has the tag
        imagesWithTag.push(image)
      }
    }

    callback(imagesWithTag)  // return the images
  })
}

function saveTag (tagInfo) {
  console.log('well what the fuck')
}

module.exports = {saveImage: saveImage, saveTag: saveTag, findByTag: findByTag}
