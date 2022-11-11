const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const scryfallCollection = database.collection('scryfall')

const util = require('./scryfall_util.js')


const Scryfall = {}  // This will be the exported module

async function insertCardsIntoDatabase(cards) {
  await scryfallCollection.deleteMany({})  // Remove old data
  await scryfallCollection.insertMany(cards, { ordered: true })
}

Scryfall.fetchAll = async function() {
  return await scryfallCollection.find({})
}

Scryfall.updateAll = async function() {
  console.log('Update all Scryfall data')
  const cards = await util.fetchFromScryfallAndClean()
  console.log('...insert into database')
  await insertCardsIntoDatabase(cards)
  console.log('...update complete')
}

module.exports = Scryfall
