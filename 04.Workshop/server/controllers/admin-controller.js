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
  },

  addAdmin: (req, res) => {
    // converts a normal user to an admin
    if (!req.user.isAdmin()) {
      res.redirect('/')
    } else {
      let username = req.params.user
      User
        .findOne({username: username})
        .then(user => {
          if (!user) {
            req.session.nonFatalError = `User ${username} does not exist!`
            res.redirect('/')
          } else {
            user.roles.push('Admin')
            user.save((err) => {
              if (err) {
                req.session.nonFatalError = err.message
                res.redirect('/')
              } else {
                res.redirect('/admins/all')
              }
            })
          }
        })
    }
  }
}
