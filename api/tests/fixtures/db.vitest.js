import { MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let mongoClient;
let db;

/**
 * Connect to the in-memory database.
 */
export async function connect() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();

  db = mongoClient.db('test');

  return {
    client: mongoClient,
    db
  };
}

/**
 * Clear all collections in the database
 */
export async function clearDatabase() {
  if (db) {
    const collections = await db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}

/**
 * Disconnect and close connection
 */
export async function closeDatabase() {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

/**
 * Create a test user
 */
export async function createUser(userData = {}) {
  const user = {
    name: userData.name || 'testuser',
    email: userData.email || 'test@example.com',
    passwordHash: userData.passwordHash || 'hashedpassword',
    createdTimestamp: userData.createdTimestamp || Date.now(),
    ...userData
  };

  const result = await db.collection('user').insertOne(user);
  return { ...user, _id: result.insertedId };
}

/**
 * Create a test game
 */
export async function createGame(gameData = {}) {
  const game = {
    name: gameData.name || 'Test Game',
    createdAt: gameData.createdAt || new Date(),
    status: gameData.status || 'active',
    ...gameData
  };

  const result = await db.collection('game').insertOne(game);
  return { ...game, _id: result.insertedId };
}

export { ObjectId }; 