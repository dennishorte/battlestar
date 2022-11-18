const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const deckCollection = database.collection('deck')


const Deck = {}
module.exports = Deck


Deck.create = async function({ userId, name, path, decklist }) {
  const creationDate = Date.now()
  const deckName = await getUniqueDecName(userId, name, path)

  const insertResult = await deckCollection.insertOne({
    userId,
    name: deckName,
    path: path || '/',
    decklist: decklist || '',
    createdTimestamp: creationDate,
    updatedTimestamp: creationDate,
  })

  if (!insertResult.insertedId) {
    throw new Error(`Deck insertion failed for user ${userId} deckname ${name}`)
  }

  return insertResult.insertedId
}


Deck.findById = async function(id) {
  return await deckCollection.findOne({ _id: id })
}

Deck.findByUserId = async function(userId) {
  const decks = await deckCollection.find({ userId })
  return await decks.toArray()
}

Deck.save = async function(deck) {
  return await deckCollection.replaceOne({ _id: deck._id }, deck)
}

Deck.rename = async function(deckId, name) {
  const filter = { _id: deckId }
  const updater = { $set: { name } }
  return await deckCollection.updateOne(filter, updater)
}


async function getUniqueDecName(userId, name, path) {
  const cursor = await deckCollection.find({
    userId,
    name: new RegExp(name + '.*'),
    path,
  })
  const decks = await cursor.toArray()

  let testName = name
  let index = 0
  while (decks.find(d => d.name === testName)) {
    index += 1
    testName = name + ' (' + index + ')'
  }

  return testName
}
