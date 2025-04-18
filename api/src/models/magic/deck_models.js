const databaseClient = require('@utils/mongo.js').client
const database = databaseClient.db('magic')
const deckCollection = database.collection('deck')

const Deck = {
  async create(user) {
    const creationDate = new Date()
    const insertResult = await deckCollection.insertOne({
      name: 'New Deck',
      userId: user._id,
      cardIdsByZone: {
        main: [],
        side: [],
        command: [],
      },
      timestamps: {
        created: creationDate,
        updated: creationDate,
      },
    })

    if (!insertResult.insertedId) {
      throw new Error('Deck insertion failed')
    }

    return await this.findById(insertResult.insertedId)
  },

  async duplicate(user, deck) {
    const newDeck = await this.create(user)
    deck = { ...deck }
    deck._id = newDeck._id
    deck.userId = user._id
    return await this.save(deck)
  },

  async save(deck) {
    return await deckCollection.findOneAndUpdate(
      { _id: deck._id },
      {
        $set: {
          name: deck.name,
          cardIdsByZone: deck.cardIdsByZone,
          'timestamps.updated': new Date(),
        }
      },
      { returnDocument: 'after' }
    )
  },

  async findById(id) {
    return await deckCollection.findOne({ _id: id })
  },

  async findByUserId(userId) {
    const decks = await deckCollection.find({ userId })
    return await decks.toArray()
  },
}

module.exports = Deck
