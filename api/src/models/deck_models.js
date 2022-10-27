const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const deckCollection = database.collection('deck')


const Deck = {}


Deck.create = async function(userId, name) {
  const creationDate = Date.now()

  const insertResult = await deckCollection.insertOne({
    userId,
    name,
    decklist: [],
    createdTimestamp: creationDate,
    updatedTimestamp: creationDate,
  })

  if (!insertResult.insertedId) {
    throw new Error(`Deck insertion failed for user ${userId} deckname ${name}`)
  }

  return insertResult.insertedId
}


Deck.findByUserId = async function(userId) {
  const decks = await deckCollection.find({ userId })
  return await decks.toArray()
}


Deck.rename = async function(deckId, name) {
  const filter = { _id: deckId }
  const updater = { $set: { name } }
  return await deckCollection.updateOne(filter, updater)
}
