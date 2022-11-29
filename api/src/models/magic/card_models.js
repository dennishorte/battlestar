const fs = require('fs')

const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const cardCollection = database.collection('card')
const scryfallCollection = database.collection('scryfall')
const scryfallVersionCollection = database.collection('scryfall_version')

const Card = {}
module.exports = Card

Card.fetchAll = async function() {
  const scryfallCursor = await scryfallCollection.find({})
  const scryfallCards = await scryfallCursor.toArray()

  const scryfallVersion = await scryfallVersionCollection.findOne({})

  return {
    cards: scryfallCards,
    version: scryfallVersion.version,
  }
}

Card.version = async function() {
  const result = await scryfallVersionCollection.findOne({})
  return result.version
}
