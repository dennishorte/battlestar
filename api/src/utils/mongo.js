const { MongoClient } = require('mongodb')
const logger = require('./logger')

let client

async function connectToMongoDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-center'
    client = new MongoClient(uri)
    await client.connect()
    
    logger.info('Connected to MongoDB')
    return client
  }
  catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`)
    throw error
  }
}

// Connect to MongoDB when this module is imported
if (process.env.NODE_ENV !== 'test') {
  connectToMongoDB()
}

module.exports = {
  get client() {
    if (!client && process.env.NODE_ENV !== 'test') {
      throw new Error('MongoDB client not connected. Call connectToMongoDB() first.')
    }
    return client
  },
  connectToMongoDB
}
