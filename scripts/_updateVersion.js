const fs = require('fs')

const databaseClient = require('../api/src/utils/mongo.js').client
const database = databaseClient.db('meta')
const versionsCollection = database.collection('versions')


async function main() {

  // Generate the latest version
  const version = Date.now()

  // Write the latest version into the database
  await versionsCollection.updateOne({ name: 'app' }, { $set: { value: version } })

  // Write the latest version into the code
  fs.writeFileSync('./app/src/assets/version.js', 'export default ' + version + '\n')
  fs.writeFileSync('./api/src/version.js', 'module.exports = ' + version + '\n')

  process.exit(0)
}

main()
