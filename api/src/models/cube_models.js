const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const cubeCollection = database.collection('cube')


const Cube = {}
module.exports = Cube


Cube.create = async function({ userId, name, path }) {
  const creationDate = Date.now()
  const cubeName = await getUniqueDecName(userId, name, path)

  const insertResult = await cubeCollection.insertOne({
    userId,
    name: cubeName,
    path: path || '/',
    kind: 'cube',
    cardlist: '',
    public: false,
    createdTimestamp: creationDate,
    updatedTimestamp: creationDate,
  })

  if (!insertResult.insertedId) {
    throw new Error(`Cube insertion failed for user ${userId} cubename ${name}`)
  }

  return insertResult.insertedId
}


Cube.findById = async function(id) {
  return await cubeCollection.findOne({ _id: id })
}


Cube.save = async function(cube) {
  return await cubeCollection.replaceOne({ _id: cube._id }, cube)
}


Cube.rename = async function(cubeId, name) {
  const filter = { _id: cubeId }
  const updater = { $set: { name } }
  return await cubeCollection.updateOne(filter, updater)
}


async function getUniqueDecName(userId, name, path) {
  const cursor = await cubeCollection.find({
    userId,
    name: new RegExp(name + '.*'),
    path,
  })
  const cubes = await cursor.toArray()

  let testName = name
  let index = 0
  while (cubes.find(d => d.name === testName)) {
    index += 1
    testName = name + ' (' + index + ')'
  }

  return testName
}
