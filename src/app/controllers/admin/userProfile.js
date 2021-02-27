const User = require('../../models/User')

module.exports = {
  async index(req, res) {
    const {user} = req
  
    res.render("admin/users/index", {user})
  },

  async put(req,res) {
    try {
      let {name, email} = req.body

      await User.update(user.id, {
        name,
        email
      })

      return res.render("admin/users/index", {
        success: "Conta atualizada com sucesso!"
      })

    } catch(err) {
      console.error(err)
      return res.render("admin/users/index", {
        error: "Alguma coisa deu errado. Tente novamente, por favor."
      })
    }
  }
}