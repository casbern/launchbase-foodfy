const { Pool } = require("pg")

module.exports = new Pool({
	user: process.env.DB_USER || "foodfy",
	password: process.env.DB_PASSWORD || "123456",
	host: process.env.DB_HOST || "localhost",
	port: 5433,
	database: process.env.DB_DATABASE || "foodfy",
})
