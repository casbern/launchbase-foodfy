const express = require('express')
const routes = express.Router()
const chefs = require('./app/controllers/admin/chefs.js')
const recipes = require('./app/controllers/admin/recipes.js')
const users = require('./app/controllers/admin/users.js')
const userProfile = require('./app/controllers/admin/userProfile.js')
const session = require('./app/controllers/admin/session.js')
const main = require('./app/controllers/main.js')

const userValidator = require('./app/Validators/user.js')
const sessionValidator = require('./app/Validators/session.js')

const { redirectToLogin } = require('./app/middlewares/session.js')
const { isLoggedRedirectToUsers } = require('./app/middlewares/session.js')

const { onlyAdmin } = require('./app/middlewares/permissions.js')
const { canModifyRecipes } = require('./app/middlewares/permissions.js')
const { canModifyUsers } = require('./app/middlewares/permissions.js')
const { canDeleteUsers } = require('./app/middlewares/permissions.js')

const multer = require('./app/middlewares/multer')

module.exports = routes

routes.get("/", main.index) 
routes.get("/about", main.about)
routes.get("/chefs", main.chefs)
routes.get("/recipes", main.recipes)
routes.get("/recipes/:id", main.recipe)
routes.get("/results", main.results)   

//ADMINISTRATIVE AREA
//RECIPES
routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", redirectToLogin, recipes.create)
routes.post("/admin/recipes", multer.array("photos", 5), redirectToLogin, recipes.post)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", redirectToLogin, canModifyRecipes, recipes.edit)
routes.put("/admin/recipes", multer.array("photos", 5), redirectToLogin, canModifyRecipes, recipes.put)
routes.delete("/admin/recipes", redirectToLogin, canModifyRecipes, recipes.delete)

//CHEFS
routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", redirectToLogin, onlyAdmin, chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", redirectToLogin, onlyAdmin, chefs.edit)
routes.post("/admin/chefs", multer.array("avatar", 1), redirectToLogin, onlyAdmin, chefs.post)
routes.put("/admin/chefs",multer.array("avatar", 1), redirectToLogin, onlyAdmin, chefs.put)
routes.delete("/admin/chefs", redirectToLogin, onlyAdmin, chefs.delete)

//USERS
//LOGIN / LOGOUT
routes.get("/users/login", isLoggedRedirectToUsers, session.loginForm)
routes.post("/users/login", sessionValidator.login, session.login)
routes.post("/users/logout", session.logout)

//RESET PASSWORD / FORGOT
routes.get("/users/forgot-password", session.forgotForm)
routes.get("/users/reset-password", session.resetForm)
routes.post("/users/forgot-password", sessionValidator.forgot, session.forgot)
routes.post("/users/reset-password", sessionValidator.reset, session.reset)

//LOGGED USER
routes.get("/admin/profile", redirectToLogin, userValidator.index, userProfile.index)
routes.put("/admin/profile", redirectToLogin, userValidator.update, userProfile.put) 

//ADMIN-USER
routes.get("/admin/users", onlyAdmin, users.list)
routes.get("/admin/users/create", redirectToLogin, onlyAdmin, users.createUser)
routes.post("/admin/users", redirectToLogin, onlyAdmin, userValidator.post, users.post)

routes.get("/admin/users/:id/edit", redirectToLogin, canModifyUsers, users.edit)
routes.put("/admin/users", redirectToLogin, canModifyUsers, users.update)
routes.get("/admin/users/:id/delete", redirectToLogin, canDeleteUsers, users.delete)
routes.delete("/admin/users", redirectToLogin, canDeleteUsers, users.delete)
 