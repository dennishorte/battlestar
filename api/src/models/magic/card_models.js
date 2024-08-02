const fs = require('fs')
const { Mutex } = require('../../util/mutex.js')

const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')

const countersCollection = database.collection('counters')
const customCollection = database.collection('custom_cards')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')


const Card = {}
module.exports = Card


const versionMutex = new Mutex()


Card.fetchAll = async function(source) {
  const result = {}

  const versions = await Card.versions()

  if (!source || source === 'all' || source === 'custom') {
    const customCursor = await customCollection.find({})
    const customCards = await customCursor.toArray()

    result.custom = {
      cards: customCards,
      version: versions.custom,
    }
  }

  if (!source || source === 'all' || source === 'scryfall') {
    const scryfallCursor = await scryfallCollection.find({})
    const scryfallCards = await scryfallCursor.toArray()

    result.scryfall = {
      cards: scryfallCards,
      version: versions.scryfall,
    }
  }

  return result
}

Card.findById = async function(id) {
  const maybeScryfall = await scryfallCollection.findOne({ _id: id })
  if (maybeScryfall) {
    return maybeScryfall
  }
  else {
    return await customCollection.findOne({ _id: id })
  }
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
  await versionMutex.dispatch(async () => {
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
  return await versionMutex.dispatch(async () => {
    const record = await countersCollection.findOne({ name: 'custom_collector_number' })
    const value = record.value

    await countersCollection.updateOne(
      { name: 'custom_collector_number' },
      { $inc: { value: 1 } },
    )

    return value
  })
}
