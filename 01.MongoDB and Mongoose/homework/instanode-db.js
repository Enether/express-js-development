let mongoose = require('mongoose')
let imageSchema = require('./create-image')

function saveImage (imageInfo) {
  // save an image to the DB
  imageSchema({
    url: imageInfo.url,
    creationDate: imageInfo.date,
    description: imageInfo.description,
    tags: imageInfo.tags
  }).save()
  imageSchema.find().then(console.log)
}

function saveTag (tagInfo) {
  console.log('well what the fuck')
}

module.exports = {saveImage: saveImage, saveTag: saveTag}