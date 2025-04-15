const databaseClient = require('../../utils/mongo.js').client
const database = databaseClient.db('magic')

const scarCollection = database.collection('scar')


const Scar = {}
module.exports = Scar

Scar.apply = async function(scarId, userId, cardIdDict) {
  await scarCollection.updateOne(
    { _id: scarId },
    {
      $set: {
        appliedTo: cardIdDict,
        appliedBy: userId,
        appliedTimestamp: Date.now(),
      },
    },
  )
}

Scar.fetchByCubeId = async function(cubeId) {
  const cursor = await scarCollection.find({ cubeId })
  const scars = await cursor.toArray()
  return scars
}

Scar.fetchAvailable = async function(cubeId) {
  await _freeOld()

  const cursor = await scarCollection.find({
    cubeId,
    lockedBy: { $exists: false },
    appliedTimestamp: { $exists: false },
  })
  const scars = await cursor.toArray()
  return scars
}

Scar.lock = async function(scars, userId) {
  const scarIds = scars.map(s => s._id)

  // Fetch the scars to make sure they aren't already locked, etc.
  const cursor = await scarCollection.find({ _id: { $in: scarIds } })
  const fetched = await cursor.toArray()

  if (fetched.length != scarIds.length) {
    throw new Error('Unable to find all specified scars')
  }

  if (fetched.some(s => Boolean(s.lockedBy))) {
    throw new Error('Some or all scars are already locked')
  }

  await scarCollection.updateMany(
    { _id: { $in: scarIds } },
    {
      $set: {
        lockedBy: userId,
        lockedTimestamp: Date.now(),
      },
    },
  )
}

Scar.releaseByUser = async function(userId) {
  await _unlock({ lockedBy: userId })
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

async function _unlock(query) {
  return await scarCollection.updateMany(
    query,
    {
      $unset: {
        lockedBy: '',
        lockedTimestamp: '',
      }
    }
  )
}

async function _freeOld() {
  const maxAge = 1000 * 60 * 30  // 30 minutes
  const oldestTimestamp = Date.now() - maxAge
  await _unlock({
    lockedTimestamp: { $lt: oldestTimestamp },
  })
}
