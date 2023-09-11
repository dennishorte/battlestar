const databaseClient = require('../../util/mongo.js').client
const database = databaseClient.db('magic')

const achCollection = database.collection('achievement')

const Ach = {}
module.exports = Ach

Ach.findByCubeId = async function(cubeId) {
  const cursor = await achCollection.find({ cubeId })
  const output = await cursor.toArray()
  return output
}

Ach.claim = async function(achId, userId) {
  await achCollection.updateOne(
    { _id: achId },
    {
      $set: {
        claimed: {
          userId: userId,
          timestamp: Date.now(),
          finalized: false,
          memo: '',
        }
      }
    }
  )
}

Ach.linkFilters = async function(achId, filters) {
  await achCollection.updateOne(
    { _id: achId },
    { $set: { filters } },
  )
}

Ach.save = async function(ach) {
  if (ach.createdTimestamp) {
    ach.updatedTimestamp = Date.now()
  }
  else {
    ach.createdTimestamp = Date.now()
  }

  if (ach._id) {
    await achCollection.replaceOne({ _id: ach._id }, ach)
  }
  else {
    await achCollection.insertOne(ach)
  }
}
