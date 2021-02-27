const User = require('../models/User')
const recipe = require('../models/recipe')

function getIdFromRequest(req) {
  const result = req.params.id || req.body.id
  return parseInt(result)
}

module.exports = {
  async onlyAdmin(req, res, next) {
    const id = req.session.userId
    const user = await User.findUserData(id)

    if(user.is_admin) {
      next()
    } else {
      return res.redirect('/admin/profile')
    }
  },

  async canModifyRecipes(req, res, next) {
    //A user can edit only his recipes

    const id = req.session.userId
    const user = await User.findUserData(id)

    const result = await recipe.findByUser(user.id)
    const userRecipes = result.rows

    let recipesId = []
    for(userRecipe of userRecipes) {
      recipesId.push(userRecipe.id)
    }

    console.log(recipesId)

    const recipeId = getIdFromRequest(req)

    if(recipesId.includes(recipeId)) {
      next()
    } else {
      return res.redirect('/admin/profile')
    }

  },

  async canModifyUsers(req, res, next) {
    const sessionUserId = req.session.userId
    const urlUserId = getIdFromRequest(req)

    const userInfo = await User.findUserData(sessionUserId)

    if(userInfo.is_admin) {
      next()
    } else {
      //a normal user can modify its own profile only
      if(urlUserId == sessionUserId) {
        next()
      } else {
        return res.redirect('/admin/profile')
      }
    }

  }, 

  async canDeleteUsers(req, res, next) {
    const sessionUserId = req.session.userId
    const urlUserId = getIdFromRequest(req)

    const userInfo = await User.findUserData(sessionUserId)

    if(userInfo.is_admin && urlUserId != sessionUserId) {
      next()
    } else {
      return res.redirect('/admin/profile')
      
    }
  }
}