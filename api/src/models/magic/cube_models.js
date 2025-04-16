const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')
const cubeCollection = database.collection('cube')

const fileCommon = require('./file_common.js')


module.exports = {
  ...fileCommon({
    collection: cubeCollection,
    createFields: () => ({
      cardlist: [],
    })
  }),

  async addCard(cube, card) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $push: { cardlist: card._id } }
    )
  },

  async removeCard(cube, card) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $pull: { cardlist: card._id } }
    )
  },

  async setEditFlag(cube, newValue) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $set: { allowEdits: newValue } },
    )

    return newValue
  },

  async setPublicFlag(cube, newValue) {
    await cubeCollection.updateOne(
      { _id: cube._id },
      { $set: { public: newValue } },
    )

    return newValue
  },
}
