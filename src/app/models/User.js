const db = require("../../config/db")
const generatePassword = require("password-generator")
const {hash} = require("bcryptjs")
const mailer = require("../lib/mailer.js")

module.exports = {
  async findOne(email) {
    let query = `
      SELECT * 
      FROM users
      WHERE users.email = $1
    `
    const results = await db.query(query, [email])
    return results.rows[0]
  }, 

  async findUserData(userId) {
    let query = `
      SELECT *
      FROM users
      WHERE users.id = $1
    `

    const results = await db.query(query, [userId])
    return results.rows[0]
  },

  async getAllUsers() {
    let query = `
      SELECT id, name, email
      FROM users
    ` 

    const results = await db.query(query)
    return results.rows
  },

  async create(data) {
    const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `
    //CREATE A PASSWORD
     const password = generatePassword(8,false) //create in another module utils

    //HASH OF PASSWORD
    const passwordHash = await hash(password, 8)

    const values = [
      data.name,
      data.email,
      passwordHash,
      data.is_admin || false
    ]

    let results

    try {
      results = await db.query(query, values)
    } catch(err) {
      console.log("This is an errror when inserting users.")
      console.error(err)
    }
    
    //SEND THE PASSWORD TO THE USER
    await mailer.sendMail({
      to: data.email,
      from: "no-reply@foodfy.com.br",
      subject: "Sua senha temporária",
      html: `
        <h2>Essa é a sua senha temporária</h2>
        <p><strong>${password}</strong></p>
        <p>Agora você já pode se logar no nosso site!</p>
      `
    })

    if(results) {
      return results.rows[0].id
    }
  }, 

  async update(userData) {

    const query = `
    UPDATE users SET
      name=$1,
      email=$2,
      is_admin=$3
    WHERE id=$4
    `
    const values = [
      userData.name,
      userData.email,
      userData.is_admin,
      userData.id
    ]   

  return db.query(query, values)

  },

  async delete(userId) {
    const query = `
      DELETE FROM users
      WHERE users.id = $1
      `

    return await db.query(query, [userId])
  }
}

