const fs = require('fs')

const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const cardCollection = database.collection('card')
const scryfallCollection = database.collection('scryfall')

const Card = {}
module.exports = Card

Card.fetchAll = async function() {
  const scryfallCursor = await scryfallCollection.find({})
  return await scryfallCursor.toArray()
}
