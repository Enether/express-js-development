// this module is used to save an uploaded image from the user to a desired destination
let fs = require('fs')

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

function saveImage (articleTitle, imagePath, imageName) {
  // if the user has uploaded an image
  // images should be saved in the following model
  // /public/images/articles/{articleTitle}/{some name}.jpg
  let articleTitleDir = './public/images/articles/' + articleTitle

  if (!fs.existsSync(articleTitle)) {
    fs.mkdirSync(articleTitleDir)
  }

  // due to us having a static file handler at the public folder, save the url as
  // /public/images/articles/{articleTitle}/1.jpg to => /images/articles/{articleTitle}/1.jpg
  // TODO: Maybe make a static handler to public/images
  let articleImagePath = '/images/articles/' + articleTitle + '/' + imageName
  let articleImageDestinationPath = './public' + articleImagePath
  // save the image
  copyFile(imagePath, articleImageDestinationPath, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Article image saved successfully to ' + '.' + articleImageDestinationPath)
    } })

  return articleImagePath
}

module.exports = saveImage