const fs = require('fs')

const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const scryfallCollection = database.collection('scryfall')
const scryfallVersionCollection = database.collection('scryfall_version')


const Scryfall = {}  // This will be the exported module

async function insertCardsIntoDatabase(cards, version) {
  await scryfallCollection.deleteMany({})  // Remove old data
  await scryfallCollection.insertMany(cards, { ordered: true })

  await scryfallVersionCollection.deleteMany({})
  await scryfallVersionCollection.insertOne({ version })
}

Scryfall.fetchAll = async function() {
  const cursor = await scryfallCollection.find({})
  return await cursor.toArray()
}

Scryfall.updateAll = async function() {
  const scryfallFolder = __dirname + '/../../../scripts/card_data'
  const files = fs
    .readdirSync(scryfallFolder)
    .filter(filename => filename.startsWith('default-cards-'))
    .sort()
  const latest = files[files.length - 1]

  console.log('loading card data from ' + latest)

  const data = fs.readFileSync(scryfallFolder + '/' + latest).toString()
  const cards = JSON.parse(data)
  await insertCardsIntoDatabase(cards, latest)

  return {
    count: Object.keys(cards).length,
    filename: latest,
  }
}

module.exports = Scryfall
