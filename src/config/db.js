const {Pool} = require('pg')

module.exports = new Pool ({
  user: process.env.DB_USER || "foodifyuser",
  password: process.env.DB_PASSWORD || "foodifymypass",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  database: process.env.DB_DATABASE || "foodify",
  ssl: {
    rejectUnauthorized: false
  }
})