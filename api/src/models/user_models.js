const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const userCollection = database.collection('user')


const User = {}  // This will be the exported module

User.all = async function(projection) {
  const filter = {
    deactivated: { $exists: false }
  }

  if (!projection) {
    projection = {
      name: 1,
      slack: 1,
    }
  }

  return userCollection.find(filter).project(projection).toArray()
}

User.checkPassword = async function(name, password) {
  const user = await User.findByName(name)

  if (!user) {
    throw `User not found (${name})`
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) {
    return null
  }

  return user
}

User.deactivate = async function(id) {
  const filter = { _id: id }
  const updater = { $set: { deactivated: true } }
  return await userCollection.updateOne(filter, updater)
}

User.isEmpty = async function() {
  try {
    const one = await userCollection.findOne({})
    return !one
  }
  catch (err) {
    console.log(err)
  }
}

User.create = async function({ name, password, slack }) {
  const existingUser = await User.findByName(name)
  if (!!existingUser) {
    throw `User with name (${name}) already exists`
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const insertResult = await userCollection.insertOne({
    name,
    slack,
    passwordHash,
    createdTimestamp: Date.now(),
  })
  const { insertedId } = insertResult

  if (!insertedId) {
    throw 'User insert failed'
  }

  User.setTokenForUserById(insertedId)

  return await User.findById(insertedId)
}

User.findById = async function(id) {
  return await userCollection.findOne({ _id: id })
}

User.findByIds = async function(ids) {
  return await userCollection.find({ _id: { $in: ids } })
}

User.findByName = async function(name) {
  return await userCollection.findOne({ name })
}

User.setTokenForUserById = async function(object_id) {
  const filter = { _id: object_id }
  const updater = { $set: { token: User.util.generateToken(object_id) } }
  const result = await userCollection.updateOne(filter, updater)
}


////////////////////////////////////////////////////////////
// User.util

User.util = {}

User.util.generateToken = function(id) {
  if (typeof id === 'object') {  // Probably a mongodb ObjectId
    id = id.toString()
  }

  return jwt.sign({ user_id: id }, process.env.SECRET_KEY)
}


////////////////////////////////////////////////////////////
// Exports

module.exports = User
