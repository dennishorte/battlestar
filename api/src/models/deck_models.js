const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const deckCollection = database.collection('deck')


const Deck = {}
module.exports = Deck


Deck.create = async function({ userId, name, path }) {
  const creationDate = Date.now()

  const insertResult = await deckCollection.insertOne({
    userId,
    name,
    path,
    decklist: '',
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
