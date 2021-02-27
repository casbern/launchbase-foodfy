module.exports = {
  redirectToLogin(req, res, next) {
    if(!req.session.userId) {
      return res.redirect('/users/login')
    }
    next()
  },

  isLoggedRedirectToUsers(req, res, next) {
    if(req.session.userId) {
      return res.redirect('/admin/profile')
    }
    next()
  }

}

