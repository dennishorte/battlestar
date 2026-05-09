import { client as databaseClient } from '../../utils/mongo.js'

const database = databaseClient.db('magic')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Scryfall = {}

const MD5_ID_PATTERN = /^scryfall-md5-[0-9a-f]{32}$/

function validateCard(card) {
  if (!card._id || typeof card._id !== 'string') {
    console.log(card)
    throw new Error('Card missing _id or _id is not a string')
  }
  if (!MD5_ID_PATTERN.test(card._id)) {
    throw new Error(`Invalid MD5 format for card ${card.name}: ${card._id}`)
  }
}

Scryfall.fetchAll = async function() {
  const cursor = scryfallCollection.find({})
  return await cursor.toArray()
}

/**
 * Streaming-update primitives. The worker calls these in order:
 *
 *   await Scryfall.beginReplace()
 *   for each chunk: await Scryfall.insertBatch(chunk)
 *   await Scryfall.commitVersion(version)
 *
 * This keeps memory bounded to one chunk at a time instead of buffering
 * the whole ~600MB card set as a single in-memory array before insert.
 */
Scryfall.beginReplace = async function() {
  await scryfallCollection.deleteMany({})
}

Scryfall.insertBatch = async function(cards) {
  if (!cards.length) {
    return
  }
  for (const card of cards) {
    validateCard(card)
  }
  await scryfallCollection.insertMany(cards, { ordered: true })
}

Scryfall.commitVersion = async function(version) {
  const versionRecord = await versionCollection.findOne({ name: 'scryfall' })
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

export default Scryfall
