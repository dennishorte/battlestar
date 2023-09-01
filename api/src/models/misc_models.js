const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('meta')
const versionsCollection = database.collection('versions')


const Misc = {}
module.exports = Misc


Misc.appVersion = async function() {
  return await versionsCollection.findOne({ name: 'app' })
}
