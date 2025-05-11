const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer
let mongoClient
let db

/**
 * Connect to the in-memory database.
 */
async function connect() {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 27018, // Using a different port to avoid conflicts
    }
  })
  const mongoUri = mongoServer.getUri()

  mongoClient = new MongoClient(mongoUri)
  await mongoClient.connect()

  db = mongoClient.db('test')

  return {
    client: mongoClient,
    db
  }
}

/**
 * Clear all collections in the database
 */
async function clearDatabase() {
  if (db) {
    const collections = await db.collections()
    for (const collection of collections) {
      await collection.deleteMany({})
    }
  }
}

/**
 * Disconnect and close connection
 */
async function closeDatabase() {
  if (mongoClient) {
    await mongoClient.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
}

/**
 * Create a test user
 */
async function createUser(userData = {}) {
  const user = {
    name: userData.name || 'testuser',
    email: userData.email || 'test@example.com',
    passwordHash: userData.passwordHash || 'hashedpassword',
    createdTimestamp: userData.createdTimestamp || Date.now(),
    ...userData
  }

  const result = await db.collection('user').insertOne(user)
  return { ...user, _id: result.insertedId }
}

/**
 * Create a test game
 */
async function createGame(gameData = {}) {
  const game = {
    name: gameData.name || 'Test Game',
    createdAt: gameData.createdAt || new Date(),
    status: gameData.status || 'active',
    ...gameData
  }

  const result = await db.collection('game').insertOne(game)
  return { ...game, _id: result.insertedId }
}

module.exports = {
  connect,
  clearDatabase,
  closeDatabase,
  createUser,
  createGame,
  ObjectId
}
