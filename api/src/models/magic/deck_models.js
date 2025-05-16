import { client as databaseClient } from '../../utils/mongo.js'
const database = databaseClient.db('magic')
const deckCollection = database.collection('deck')

const Deck = {
  async create(user, opts={}) {
    const creationDate = new Date()
    const insertResult = await deckCollection.insertOne({
      name: opts.name || 'New Deck',
      userId: user._id,
      links: opts.links || {},
      format: 'custom',
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

  async delete(deck) {
    await deckCollection.deleteOne({ _id: deck._id })
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
          format: deck.format,
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

export default Deck
