const db = require("../../config/db")

module.exports = {
  async update(userId, fields) {
    let query = "UPDATE users SET"

    Object.keys(fields).map( (key, index, array) => {
      if((index + 1) < array.length) {
        query = ` ${query}
        ${key} = '${fields[key]}',
        `
      } else {
        query = `${query}
        ${key} = '${fields[key]}'
        WHERE id = ${userId}
        `
      }
    })

    await db.query(query)
    return
  }
}