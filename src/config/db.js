const {Pool} = require('pg')

module.exports = new Pool ({
  user: "foodfyuser",
  password: "",
  host: "localhost",
  port: 5432,
  database: "launchbase_foodfy"
})