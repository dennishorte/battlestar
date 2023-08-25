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

Scar.lock = async function(scars, reason) {
  const scarIds = scars.map(s => s._id)

  // Fetch the scars to make sure they aren't already locked, etc.
  const cursor = await scarCollection.find({ _id: { $in: scarIds } })
  const fetched = await cursor.toArray()

  if (fetched.length != scarIds.length) {
    throw new Error('Unable to find all specified scars')
  }

  if (fetched.some(s => s.locked)) {
    throw new Error('Some or all scars are already locked')
  }

  await scarCollection.updateMany(
    { _id: { $in: scarIds } },
    {
      $set: {
        locked: true,
        lockedReason: reason,
      },
    },
  )
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

Scar.unlock = async function(scars) {
  const scarIds = scars.map(s => s._id)

  await scarCollection.updateMany(
    { _id: { $in: scarIds } },
    {
      $set: { locked: false },
      $unset: { lockedReason: 0 },
    },
  )
}
