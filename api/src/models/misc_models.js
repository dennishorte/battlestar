import { client as databaseClient } from '#/utils/mongo.js'
const database = databaseClient.db('meta')
const versionsCollection = database.collection('versions')


const Misc = {}

Misc.appVersion = async function() {
  return await versionsCollection.findOne({ name: 'app' })
}

export default Misc
