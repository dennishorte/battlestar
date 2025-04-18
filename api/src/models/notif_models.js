const databaseClient = require('@utils/mongo.js').client
const database = databaseClient.db('games')
const notifCollection = database.collection('notificationThrottle')

const Notif = {}
module.exports = Notif

const cutoff = 1000 * 60 * 60 // one hour

function _makeKey(user, game) {
  return {
    userId: user._id,
    gameId: game._id,
  }
}

// Find all notification throttles older than the cutoff and remove them.
Notif.clean = async function() {
  const oneHourAgo = Date.now() - cutoff
  await notifCollection.deleteMany({
    createdAt: { $lt: oneHourAgo }
  })
}

Notif.clear = async function(user, game) {
  await notifCollection.deleteOne(_makeKey(user, game))
}

// Return true if the notification should be throttled.
Notif.throttleOrSet = async function(user, game) {
  const item = await notifCollection.findOne(_makeKey(user, game))
  const throttle = Boolean(item) && (Date.now() - item.createdAt < cutoff)

  if (!throttle) {
    // Set throttle
    await notifCollection.updateOne(
      _makeKey(user, game),
      { $set: { createdAt: Date.now() } },
      { upsert: true },
    )
  }

  return throttle
}
