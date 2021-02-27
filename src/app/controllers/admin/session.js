const UserProfile = require('../../models/UserProfile')
const {hash} = require('bcryptjs')
const mailer = require('../../lib/mailer')
const crypto = require('crypto')

module.exports = {
  loginForm(req,res) {
    return res.render("admin/session/index")
  },

  login(req,res) {
    req.session.userId = req.user.id

    return res.redirect("/admin/profile")
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect("/users/login")
  },

  forgotForm(req,res) {
    return res.render('admin/session/forgot-password')
  },

  async forgot(req,res) {
    const user = req.user 

    try {
      //token for the user
    const token = crypto.randomBytes(20).toString("hex")

    //create an expire date for the token
    let now = new Date()
    now = now.setHours(now.getHours() + 1)

    await UserProfile.update(user.id, {
      reset_token: token,
      reset_token_expires: now
    })

    //send an email with the link to recover the password
    await mailer.sendMail({
      to: user.email,
      from: 'no-reply@foodfy.com.br',
      subject: 'Recuperação de senha',
      html: `<h2>Esqueceu sua senha?</h2>
      <p>Não se preocupe, clique no link abaixo para recuperar sua senha.</p>
      <p>
        <a href="http://localhost:3000/users/reset-password?token=${token}" target="_blank">
          Recuperar senha
        </a>
      </p>
      <p>Ou, se preferir, copie e cole a URL no seu browser: 
        http://localhost:3000/users/reset-password?token=${token}
      </p>`
    })

    //let the user know that we send the email
    return res.render("admin/session/forgot-password", {
      success: "Verifique seu email para resetar sua senha."
    })

    } catch(err) {
      console.error(err)
      return res.render("admin/session/forgot-password", {
        error: "Ops.. Ocorreu um erro. Tente novamente, por favor."
      })
    }
  },

  resetForm(req,res) {
    return res.render('admin/session/reset-password', {
      token: req.query.token
    })
  },

  async reset(req,res) {
    const { user } = req

    const { password, token } = req.body

    try {
      //create a new password hash
      const newPassword = await hash(password, 8)

      //update the user
      await UserProfile.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      })

      //let the user knows that the password was updated successfully
      return res.render("admin/session/index", {
        user: req.body,
        success: "Senha atualizada! Faça o seu login."
      })

    } catch(err) {
      console.error(err)
      res.render("admin/session/reset-passsword", {
        user: req.body,
        token,
        error: "Ops! Algum erro aconteceu. Tente novamente, por favor."
      })
    }
  }
}