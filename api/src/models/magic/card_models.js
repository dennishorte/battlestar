const fs = require('fs')

const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')

const customCollection = database.collection('custom_cards')
const scryfallCollection = database.collection('scryfall')
const versionCollection = database.collection('versions')

const Card = {}
module.exports = Card

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

Card.versions = async function() {
  const versions = await versionCollection.findOne({})

  return {
    custom: versions.custom,
    scryfall: versions.scryfall,
  }
}
