const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const deckCollection = database.collection('deck')

const fileCommon = require('./file_common.js')


const Deck = {
  ...fileCommon({
    collection: deckCollection,
    createFields: () => ({
      cardlist: '',
    })
  })
}
module.exports = Deck
