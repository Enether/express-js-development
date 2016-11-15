/**
 * this module exports an object holding ANOTHER OBJECT holding functions for each of the pages the controllers manages
 * ex: homeControllers returns an object holding as key the page and as value a functions
 * {
    index: (req, res) => {
      res.render('home/index')
    }
   }
 */
const homeController = require('./home-controller')
const userController = require('./user-controller')
const threadController = require('./thread-controller')
const adminController = require('./admin-controller')

module.exports = {
  home: homeController,
  user: userController,
  thread: threadController,
  admin: adminController
}
