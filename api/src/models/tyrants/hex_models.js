const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('tyrants')
const hexCollection = database.collection('hex')

const Hex = {}

Hex.fetchAll = async function() {
  const cursor = await hexCollection.find({})
  const hexes = await cursor.toArray()
  return hexes
}

Hex.save = async function(hex) {
  await hexCollection.replaceOne({ name: hex.name }, hex, { upsert: true })
}

module.exports = Hex
