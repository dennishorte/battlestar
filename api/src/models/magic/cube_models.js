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

  // cubeId is a mongoDB ObjectId
  // cardId is a magic card ID dict
  async removeCard(cubeId, cardId) {
    const cube = await Cube.findById(cubeId)

    // Check for an exact id match
    for (const card of cube.cardlist) {
      if (mag.util.card.cardIdEquals(card, cardId)) {
        util.array.remove(card)
        return
      }
    }

    // Check for a name only id match
    for (const card of cube.cardlist) {
      if (mag.util.card.cardIdEquals(card, cardId, { nameOnly: true })) {
        util.array.remove(card)
        return
      }
    }

    throw new Error(`Unable to remove card. Card not found. ${card.name}`)
  },

  async toggleEdits(cubeId) {
    const cube = await Cube.findById(cubeId)
    const newValue = !Boolean(cube.allowEdits)

    await cubeCollection.updateOne(
      { _id: cubeId },
      { $set: { allowEdits: newValue } },
    )

    return newValue
  },
}
module.exports = Cube
