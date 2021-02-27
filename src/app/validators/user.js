const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
  const keys = Object.keys(body)

  for(key of keys) {
    if(body[keys] == "") {
      return {
        user: req.body,
        error: "Por favor, preencha todos os campos."
      }
    }
  }
}

async function index(req,res,next) {
  const {userId: id} = req.session

  const user = await User.findUserData(id)

  if (!user) {
    return res.render("admin/users/create", {
      error: "Usuário não encontrado."
    })
  }

    req.user = user

    next()
}
 
async function post(req,res,next) {
  //check if it has all fields
  const keys = Object.keys(req.body)
    
  for(key of keys) {
    if (req.body[key] == "") {
      return res.render("admin/users/create", {
        user: req.body,
        error: "Preencha todos os campos, por favor."
      })
    }
  }

  //check if user exists (email)
  const {email} = req.body
  console.log(email)

  const user = await User.findOne(email)

  if (user) {
    return res.render("admin/users/create", {
      user: req.body,
      error: "Usuário já cadastrado."
    })
  }

  next()
}

async function update(req,res,next) {
  const fillAllFields = checkAllFields(req.body)

  if(fillAllFields) {
    return res.render("admin/users/index", fillAllFields)
  }

  const {id, password} = req.body

  if(!password) {
    return res.render("admin/users/index", {
      user: req.body,
      error: "Coloque sua senha para atualizar o seu cadastro."
    })
  }

  const user = await User.findUserData(id)

  const passed = await compare(passed, user.password)

  if (!passed) {
    return res.render('admin/users/index', {
      user: req.body,
      error: "Senha incorreta."
    })
  }

  req.user = user

  next()
}

module.exports = {
  index,
  post,
  update
}