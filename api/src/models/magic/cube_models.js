const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')
const cubeCollection = database.collection('cube')

const fileCommon = require('./file_common.js')


const Cube = {
  ...fileCommon({
    collection: cubeCollection,
    createFields: () => ({
      cardlist: [],
    })
  }),

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
