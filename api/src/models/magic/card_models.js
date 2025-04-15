const AsyncLock = require('async-lock')

const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')

const countersCollection = database.collection('counters')
const customCollection = database.collection('custom_cards')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Card = {}
module.exports = Card


const lock = new AsyncLock()


Card.fetchAll = async function(source) {
  const result = {}

  const versions = await Card.versions()

  // Set up promises for concurrent execution
  const promises = []

  if (!source || source === 'all' || source === 'custom') {
    const customPromise = customCollection.find({}).toArray()
      .then(customCards => {
        result.custom = {
          cards: customCards,
          version: versions.custom,
        }
      })
    promises.push(customPromise)
  }

  if (!source || source === 'all' || source === 'scryfall') {
    const scryfallPromise = scryfallCollection.find({}).toArray()
      .then(scryfallCards => {
        result.scryfall = {
          cards: scryfallCards,
          version: versions.scryfall,
        }
      })
    promises.push(scryfallPromise)
  }

  // Wait for all database operations to complete in parallel
  await Promise.all(promises)

  return result
}

Card.findById = async function(id) {
  // Query both collections in parallel
  const [scryfallCard, customCard] = await Promise.all([
    scryfallCollection.findOne({ _id: id }),
    customCollection.findOne({ _id: id })
  ])
  
  // Return the first non-null result
  return scryfallCard || customCard || null
}

Card.findByIds = async function(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return []
  }
  
  // Query both collections in parallel
  const [scryfallCards, customCards] = await Promise.all([
    scryfallCollection.find({ _id: { $in: ids } }).toArray(),
    customCollection.find({ _id: { $in: ids } }).toArray()
  ])
  
  // Combine results from both collections
  return [...scryfallCards, ...customCards]
}

Card.insertCustom = async function(card) {

  // Since this is intended to create a new card, make sure we don't insert with
  // an existing MongoDB id.
  if (card._id) {
    delete card._id
  }

  // Sometimes, we copy an original card to a new cube.
  if (card.custom_id) {
    delete card.custom_id
  }

  card.set = 'custom'
  card.collector_number = await _getNextCollectorNumber()
  card.legal = ['custom']

  const { insertedId } = await customCollection.insertOne(card)

  // MongoDB ids are globally unique, so they make good unique identifiers for custom cards.
  await customCollection.updateOne(
    { _id: insertedId },
    { $set: { custom_id: insertedId } },
  )

  await _incrementCustomCardDatabaseVersion()

  return await customCollection.findOne({ _id: insertedId })
}

Card.save = async function(card) {
  if (card._id) {
    await customCollection.replaceOne(
      { _id: card._id },
      card
    )
    await _incrementCustomCardDatabaseVersion()
    return card._id
  }
  else {
    const insertedCard = await Card.insertCustom(card)
    // The database increment is handled in insertCustom
    // await _incrementCustomCardDatabaseVersion()
    return insertedCard._id
  }
}

Card.versions = async function() {
  const versionCursor = await versionCollection.find({})
  const versionArray = await versionCursor.toArray()

  const versions = {}

  for (const entry of versionArray) {
    versions[entry.name] = entry.value
  }

  return versions
}


async function _incrementCustomCardDatabaseVersion() {
  await lock.acquire('version:custom-db', async () => {
    const customVersion = await versionCollection.findOne({
      name: 'custom',
    })

    if (customVersion) {
      await versionCollection.updateOne(
        { name: 'custom' },
        { $inc: { value: 1 } }
      )
    }
    else {
      await versionCollection.insertOne({
        name: 'custom',
        value: 1,
      })
    }
  })
}

async function _getNextCollectorNumber() {
  return await lock.acquire('version:card-number', async () => {
    const record = await countersCollection.findOne({ name: 'custom_collector_number' })
    const value = record.value

    await countersCollection.updateOne(
      { name: 'custom_collector_number' },
      { $inc: { value: 1 } },
    )

    return value
  })
}
