const fs = require('fs')

const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Scryfall = {}  // This will be the exported module

async function insertCardsIntoDatabase(cards, version) {
  await scryfallCollection.deleteMany({})  // Remove old data
  await scryfallCollection.insertMany(cards, { ordered: true })

  const versionRecord = await versionCollection.findOne({
    name: 'scryfall',
  })

  if (versionRecord) {
    await versionCollection.updateOne(
      { _id: versionRecord._id },
      { $set: { value: version } }
    )
  }
  else {
    await versionCollection.insertOne({ name: 'scryfall', value: version })
  }
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
