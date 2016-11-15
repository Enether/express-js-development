const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  showAllAdminsPage: (req, res) => {
    // show all the admins
    if (req.user.isAdmin()) {
      User
        .find({ roles: 'Admin' })
        .then(admins => {
          res.render('admin/all', { admins: admins })
        })
    } else {
      res.redirect('/')
    }
  }
}
