module.exports = {
  // function that returns true or false if the user is authneticated
  isAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      // TODO: Append the URL the user wanted to visit to the URL, then
      // parse it from the querystring to load up the page he tried to visit
      // before logging in
      res.redirect('login')
      return
    }

    next()
  },

  isInRole: (role) => {
    return (req, res, next) => {
      // check if such a user exists (we're logged in) and if the user has that role
      if (!req.user && !req.user.roles.indexOf(role) > -1 /* user has that role */) {
        res.redirect('/')
      }

      next()
    }
  }
}
