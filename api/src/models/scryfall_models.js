const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const scryfallCollection = database.collection('scryfall')


const Scryfall = {}  // This will be the exported module

async function insertCardsIntoDatabase(cards) {
  await scryfallCollection.deleteMany({})  // Remove old data
  await scryfallCollection.insertMany(cards, { ordered: true })
}

Scryfall.updateAll = async function() {
  const cards = await util.getUpdatedCards()
  insertCardsIntoDatabase(cards)
}

module.exports = Scryfall
