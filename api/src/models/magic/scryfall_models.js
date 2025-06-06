import fs from 'fs'
import { client as databaseClient } from '../../utils/mongo.js'
const database = databaseClient.db('magic')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Scryfall = {}  // This will be the exported module

async function insertCardsIntoDatabase(cards, version) {
  // Ensure all cards have a properly formatted id as _id
  for (const card of cards) {
    // Validate that _id exists and is a string
    if (!card._id || typeof card._id !== 'string') {
      console.log(card)
      throw new Error('Card missing _id or _id is not a string')
    }

    // Convert to lowercase and validate format
    const md5Pattern = /^scryfall-md5-[0-9a-f]{32}$/
    if (!md5Pattern.test(card._id)) {
      throw new Error(`Invalid MD5 format for card ${card.name}: ${card._id}`)
    }
  }

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

Scryfall.update = async function() {
  const scryfallFolder = new URL('../../../scripts/card_data', import.meta.url).pathname
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

export default Scryfall
