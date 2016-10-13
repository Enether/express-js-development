let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let _ = require('lodash')

let imageSchema = require('./create-image')

let MIN_DATE = new Date(-8640000000000000)
let MAX_DATE = new Date(8640000000000000)

function saveImage (imageInfo) {
  // save an image to the DB
  imageSchema({
    url: imageInfo.url,
    creationDate: imageInfo.date,
    description: imageInfo.description,
    tags: imageInfo.tags
  }).save()
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

    callback(_.sortBy(imagesWithTag, [function (i) { return i.creationDate }]).reverse())  // return the images ordered by their descending dates
  })
}

function filter (options, callback) {
  /*
  @param @options - {after: minDate, before: maxDate, results: 24}
  This function filters through the images and returns images that are in between the dates and returns no more than
  results count images.

  If results is empty - return a max of 10 images
  If the after date is empty - return images only before the before date
  Same if the before date is empty - return images only after the after date
   */
  let maxImageCount = options.results || 10

  if (!options.after) {
    options.after = MIN_DATE
  }
  if (!options.before) {
    options.before = MAX_DATE
  }

  imageSchema
    .where('creationDate').lte(options.before)
    .where('creationDate').gte(options.after)
    .limit(maxImageCount)
    .exec(callback)
}

function saveTag (tagInfo) {
  console.log('Do not see a reaosn to implement it. Also how would I implement tags that have image objects in them, which image objects SHOULD have tag objects in them which have image objects in them which have tag objects in...')
}

module.exports = {saveImage: saveImage, saveTag: saveTag, findByTag: findByTag, filter: filter}
