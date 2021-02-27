const User = require('../../models/User')

module.exports = {
  async list(req, res) {

    // SHOWING A SUCCESSFUL MESSAGE AFTER DELETELING A USER
    let tp_vars = {
      allUsers: await User.getAllUsers()
    }
    if(req.query.delete) {
      tp_vars.success = "O usuário foi removido com sucesso!"
    }

    return res.render("admin/users/allUsers", tp_vars)
  },
  
  createUser(req,res) {
    return res.render('admin/users/create')
  }, 

  async post(req,res) {
    const user = await User.create(req.body)

    return res.redirect('/admin/users')
  },

  async edit(req,res) {
    const userId = req.params.id

    const user = await User.findUserData(userId)

    let tp_vars

    if(!user) {
      tp_vars = {
        error: "Esse usuário não existe."
      }
    } else {
      tp_vars = {user}
    }
    
    return res.render('admin/users/edit', tp_vars)
  },

  async update(req,res) {
    const userData = req.body

    userData.is_admin = userData.is_admin || false

    const insertUser = await User.update(userData)
    const updatedUser = await User.findUserData(userData.id)

    return res.render('admin/users/index', {
      user: updatedUser,
      success: "Os dados foram atualizados com sucesso!"
    })
  },

  async delete(req,res) {

    //let userId = (req.body.id == undefined) ? req.params.id : req.body.id
    let userId = req.params.id || req.body.id

    await User.delete(userId)
    
    return res.redirect("/admin/users?delete=true")
  }
}