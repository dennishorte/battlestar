const { MongoClient } = require("mongodb");


const db_host = process.env.DB_HOST
const db_port = process.env.DB_PORT
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_database = process.env.DB_DATABASE


const uri = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}?retryWrites=true&writeConcern=majority`

const client = new MongoClient(uri)
client.connect()

module.exports = {
  client,
}
