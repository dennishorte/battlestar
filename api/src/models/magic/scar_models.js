const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')

const scarCollection = database.collection('scar')


const Scar = {}
module.exports = Scar


Scar.fetchByCubeId = async function(cubeId) {
  const cursor = await scarCollection.find({ cubeId })
  const scars = await cursor.toArray()
  return scars
}

Scar.save = async function(scar) {
  if (scar._id) {
    await scarCollection.replaceOne(
      { _id: scar._id },
      scar
    )
    return scar
  }
  else {
    const { insertedId } = await scarCollection.insertOne(scar)
    return scarCollection.findOne({ _id: insertedId })
  }
}
