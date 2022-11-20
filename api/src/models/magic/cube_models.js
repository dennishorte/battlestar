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
  })
}
module.exports = Cube
