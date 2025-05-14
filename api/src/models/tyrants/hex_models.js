const databaseClient = require('#/utils/mongo.js').client
const database = databaseClient.db('tyrants')
const hexCollection = database.collection('hex')

const Hex = {}

Hex.fetchAll = async function() {
  const cursor = await hexCollection.find({})
  const hexes = await cursor.toArray()
  return hexes
}

Hex.delete = async function(id) {
  await hexCollection.deleteOne({ _id: id })
}

Hex.save = async function(hex) {
  if (hex._id) {
    await hexCollection.replaceOne({ _id: hex._id }, hex)
  }
  else {
    await hexCollection.replaceOne({ name: hex.name }, hex, { upsert: true })
  }
}

module.exports = Hex
