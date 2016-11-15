const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  showAllAdminsPage: (req, res) => {
    // show all the admins
    if (!req.user.isAdmin()) {
      res.redirect('/')
    } else {
      User
        .find({ roles: 'Admin' })
        .then(admins => {
          res.render('admin/all', { admins: admins })
        })
    }
  },

  showAllUsersPage: (req, res) => {
    // show all the users who are not admins
    if (!req.user.isAdmin()) {
      res.redirect('/')
    } else {
      User
        .find({ roles: { '$ne': 'Admin' } })
        .then(users => {
          res.render('admin/usersList', { users: users })
        })
    }
  }
}
