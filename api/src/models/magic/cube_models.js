const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const cubeCollection = database.collection('cube')

const fileCommon = require('./file_common.js')

const { mag, util } = require('battlestar-common')


const Cube = {
  ...fileCommon({
    collection: cubeCollection,
    createFields: () => ({
      cardlist: [],
    })
  }),

  // cubeId is a mongoDB ObjectId
  // cardId is a magic card ID dict
  async addCard(cubeId, cardId) {
    await cubeCollection.updateOne(
      { _id: cubeId },
      { $push: { cardlist: cardId } }
    )
  },

  async removeCard(cubeId, cardId) {
    const cube = await Cube.findById(cubeId)

    // Check for an exact id match
    for (const card of cube.cardlist) {
      if (mag.util.card.cardIdEquals(card, cardId)) {
        util.array.remove(card)
        await Cube.save(cube)
        return
      }
    }

    // Check for a name only id match
    for (const card of cube.cardlist) {
      if (mag.util.card.cardIdEquals(card, cardId, { nameOnly: true })) {
        util.array.remove(card)
        await Cube.save(cube)
        return
      }
    }

    throw new Error(`Unable to remove card. Card not found. ${card.name}`)
  },

  async setEditFlag(cubeId, newValue) {
    await cubeCollection.updateOne(
      { _id: cubeId },
      { $set: { allowEdits: newValue } },
    )

    return newValue
  },

  async setPublicFlag(cubeId, newValue) {
    await cubeCollection.updateOne(
      { _id: cubeId },
      { $set: { public: newValue } },
    )

    return newValue
  },
}
module.exports = Cube
