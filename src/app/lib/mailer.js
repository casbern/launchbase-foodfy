const nodemailer = require('nodemailer')

module.exports  = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "70c5312c7c2e16",
    pass: "e6accf6c3c02c9"
  }
})

