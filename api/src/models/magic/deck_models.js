const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')
const deckCollection = database.collection('deck')

const fileCommon = require('./file_common.js')


const Deck = {
  ...fileCommon({
    collection: deckCollection,
    createFields: () => ({
      cardlist: [],
    })
  }),

  async addCard(deckId, card) {
    const deck = await Deck.findById(deckId)
    deck.cardlist.push(card)
    await Deck.save(deck)
  },
}
module.exports = Deck
